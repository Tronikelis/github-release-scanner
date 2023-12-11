package virustotal_api_client

import (
	"github-release-scanner/utils/time_queue"
	"log"
	"os"
	"time"

	"github.com/levigross/grequests"
)

type VirusTotalApiClient struct {
	baseUrl  string
	headers  map[string]string
	throttle *time_queue.TimeQueueThrottled
}

func New() VirusTotalApiClient {
	apiKey := os.Getenv("VT_API_KEY")
	if apiKey == "" {
		log.Fatalln("missing VT_API_KEY")
	}

	throttle := time_queue.New(time.Minute, 4)

	return VirusTotalApiClient{
		baseUrl: "https://www.virustotal.com/api/v3",
		headers: map[string]string{
			"accept":   "application/json",
			"x-apikey": apiKey,
		},
		throttle: &throttle,
	}
}

func (client VirusTotalApiClient) getUploadUrl() (*string, error) {
	resp, err := grequests.Get(client.baseUrl+"/files/upload_url", &grequests.RequestOptions{
		Headers: client.headers,
	})
	if err != nil {
		return nil, err
	}

	data := &GetUploadUrlJSON{}

	if err = resp.JSON(&data); err != nil {
		return nil, err
	}

	return &data.Data, nil
}

func (client VirusTotalApiClient) UploadFile(filePath string) (*string, error) {
	uploadUrl, err := client.getUploadUrl()
	if err != nil {
		return nil, err
	}

	data := &UploadFileJSON{}

	fileContents, _ := os.Open(filePath)

	client.throttle.TryAndWait()
	resp, err := grequests.Post(*uploadUrl, &grequests.RequestOptions{
		Files: []grequests.FileUpload{{
			FileName:     "file",
			FieldName:    "file",
			FileContents: fileContents,
		}},
		Headers: client.headers,
	})
	if err != nil {
		return nil, err
	}

	if err := resp.JSON(data); err != nil {
		return nil, err
	}

	return &data.Data.ID, nil
}

func (client VirusTotalApiClient) CheckAnalysis(analysisID string) (uint, bool, error) {
	resp, err := grequests.Get(client.baseUrl+"/analyses/"+analysisID, &grequests.RequestOptions{
		Headers: client.headers,
	})
	if err != nil {
		return 0, false, err
	}

	data := &CheckAnalysisJSON{}

	if err := resp.JSON(data); err != nil {
		return 0, false, err
	}

	// if its not finished
	if data.Data.Attributes.Status != "completed" {
		return 0, false, nil
	}

	return uint(data.Data.Attributes.Stats.Harmless), true, nil
}
