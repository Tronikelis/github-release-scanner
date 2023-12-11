package github_api_client

import (
	"github-release-scanner/utils/time_queue"
	"log"
	"os"
	"time"

	"github.com/levigross/grequests"
)

type GithubApiClient struct {
	baseUrl  string
	headers  map[string]string
	throttle *time_queue.TimeQueueThrottled
}

func New() GithubApiClient {
	accessToken := os.Getenv("GH_ACCESS_TOKEN")
	if accessToken == "" {
		log.Fatalln("GH_ACCESS_TOKEN missing")
	}

	throttle := time_queue.New(time.Hour, 5000)

	return GithubApiClient{
		baseUrl: "https://api.github.com",
		headers: map[string]string{
			"Authorization": "Bearer " + accessToken,
		},
		throttle: &throttle,
	}
}

func (client GithubApiClient) GetRepo(fullName string) (*GetRepoJSON, error) {
	client.throttle.TryAndWait()

	response, err := grequests.Get(client.baseUrl+"/repos/"+fullName, &grequests.RequestOptions{
		Headers: client.headers,
	})
	if err != nil {
		return nil, err
	}

	data := &GetRepoJSON{}
	if err := response.JSON(data); err != nil {
		return nil, err
	}

	return data, nil

}

func (client GithubApiClient) GetRepoReleases(fullName string) (*[]GetRepoReleasesJSON, error) {
	client.throttle.TryAndWait()

	response, err := grequests.Get(client.baseUrl+"/repos/"+fullName+"/releases", &grequests.RequestOptions{
		Headers: client.headers,
	})
	if err != nil {
		return nil, err
	}

	data := &[]GetRepoReleasesJSON{}

	if err := response.JSON(data); err != nil {
		return nil, err
	}

	return data, nil
}
