package github_api_client

import (
	"errors"
	"github-release-scanner/utils/time_queue"
	"log"
	"net/url"
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
	if !response.Ok {
		return nil, errors.New(response.String())
	}
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
	if !response.Ok {
		return nil, errors.New(response.String())
	}
	if err != nil {
		return nil, err
	}

	data := &[]GetRepoReleasesJSON{}

	if err := response.JSON(data); err != nil {
		return nil, err
	}

	return data, nil
}

func (client GithubApiClient) GetRepos(name string) (*GetReposJSON, error) {
	client.throttle.TryAndWait()

	params := url.Values{}
	params.Set("q", name)

	querystring := params.Encode()
	if querystring != "" {
		querystring = "?" + querystring
	}

	response, err := grequests.Get(client.baseUrl+"/search/repositories"+querystring, &grequests.RequestOptions{
		Headers: client.headers,
	})
	if !response.Ok {
		return nil, errors.New(response.String())
	}
	if err != nil {
		return nil, err
	}

	data := &GetReposJSON{}

	if err := response.JSON(data); err != nil {
		return nil, err
	}

	return data, nil
}
