package virustotal_api_client

import (
	"errors"
	"github-release-scanner/utils/time_queue"
	"log"
	"os"
	"time"

	"github.com/levigross/grequests"
)

type VirusTotalApiClient struct {
	baseUrl string
	headers map[string]string

	throttleSlow *time_queue.TimeQueueThrottled
	throttleFast *time_queue.TimeQueueThrottled
}

func New() VirusTotalApiClient {
	apiKey := os.Getenv("VT_API_KEY")
	if apiKey == "" {
		log.Fatalln("missing VT_API_KEY")
	}

	throttleSlow := time_queue.New(time.Minute, 4)
	throttleFast := time_queue.New(time.Minute, 60)

	return VirusTotalApiClient{
		baseUrl: "https://www.virustotal.com/api/v3",
		headers: map[string]string{
			"accept":   "application/json",
			"x-apikey": apiKey,
		},
		throttleFast: &throttleFast,
		throttleSlow: &throttleSlow,
	}
}

func (client VirusTotalApiClient) getUploadUrl() (*string, error) {
	client.throttleFast.TryAndWait()

	resp, err := grequests.Get(client.baseUrl+"/files/upload_url", &grequests.RequestOptions{
		Headers: client.headers,
	})
	if !resp.Ok {
		return nil, errors.New(resp.String())
	}
	if err != nil {
		return nil, err
	}

	data := GetUploadUrlJSON{}

	if err = resp.JSON(&data); err != nil {
		return nil, err
	}

	return &data.Data, nil
}

func (client VirusTotalApiClient) UploadFile(filePath string) (*string, error) {
	client.throttleFast.TryAndWait()

	uploadUrl, err := client.getUploadUrl()
	if err != nil {
		return nil, err
	}

	data := UploadFileJSON{}

	fileContents, _ := os.Open(filePath)

	client.throttleSlow.TryAndWait()
	resp, err := grequests.Post(*uploadUrl, &grequests.RequestOptions{
		Files: []grequests.FileUpload{{
			FileName:     "file",
			FieldName:    "file",
			FileContents: fileContents,
		}},
		Headers: client.headers,
	})
	if !resp.Ok {
		return nil, errors.New(resp.String())
	}
	if err != nil {
		return nil, err
	}

	if err := resp.JSON(&data); err != nil {
		return nil, err
	}

	return &data.Data.ID, nil
}

func (client VirusTotalApiClient) CheckMaliciousCount(analysisID string) (uint, bool, error) {
	client.throttleFast.TryAndWait()

	resp, err := grequests.Get(client.baseUrl+"/analyses/"+analysisID, &grequests.RequestOptions{
		Headers: client.headers,
	})
	if !resp.Ok {
		return 0, false, errors.New(resp.String())
	}
	if err != nil {
		return 0, false, err
	}

	data := CheckAnalysisJSON{}

	if err := resp.JSON(&data); err != nil {
		return 0, false, err
	}

	// if its not finished
	if data.Data.Attributes.Status != "completed" {
		return 0, false, nil
	}

	return uint(
		data.Data.Attributes.Stats.Malicious +
			data.Data.Attributes.Stats.Suspicious), true, nil
}
