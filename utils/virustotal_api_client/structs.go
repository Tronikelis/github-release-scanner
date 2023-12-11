package virustotal_api_client

type GetUploadUrlJSON struct {
	Data string `json:"data"`
}

type UploadFileJSON struct {
	Data UploadFileJSON_Data `json:"data"`
}
type UploadFileJSON_Links struct {
	Self string `json:"self"`
}
type UploadFileJSON_Data struct {
	Type  string               `json:"type"`
	ID    string               `json:"id"`
	Links UploadFileJSON_Links `json:"links"`
}

type CheckAnalysisJSON struct {
	Data CheckAnalysisJSON_Data `json:"data"`
}
type CheckAnalysisJSON_ALYac struct {
	Category      string `json:"category"`
	EngineName    string `json:"engine_name"`
	EngineUpdate  string `json:"engine_update"`
	EngineVersion string `json:"engine_version"`
	Method        string `json:"method"`
	Result        string `json:"result"`
}
type CheckAnalysisJSON_Avast struct {
	Category      string `json:"category"`
	EngineName    string `json:"engine_name"`
	EngineUpdate  string `json:"engine_update"`
	EngineVersion string `json:"engine_version"`
	Method        string `json:"method"`
	Result        string `json:"result"`
}
type CheckAnalysisJSON_AvastMobile struct {
	Category      string      `json:"category"`
	EngineName    string      `json:"engine_name"`
	EngineUpdate  string      `json:"engine_update"`
	EngineVersion string      `json:"engine_version"`
	Method        string      `json:"method"`
	Result        interface{} `json:"result"`
}
type CheckAnalysisJSON_CATQuickHeal struct {
	Category      string `json:"category"`
	EngineName    string `json:"engine_name"`
	EngineUpdate  string `json:"engine_update"`
	EngineVersion string `json:"engine_version"`
	Method        string `json:"method"`
	Result        string `json:"result"`
}
type CheckAnalysisJSON_ClamAV struct {
	Category      string `json:"category"`
	EngineName    string `json:"engine_name"`
	EngineUpdate  string `json:"engine_update"`
	EngineVersion string `json:"engine_version"`
	Method        string `json:"method"`
	Result        string `json:"result"`
}
type CheckAnalysisJSON_Comodo struct {
	Category      string `json:"category"`
	EngineName    string `json:"engine_name"`
	EngineUpdate  string `json:"engine_update"`
	EngineVersion string `json:"engine_version"`
	Method        string `json:"method"`
	Result        string `json:"result"`
}
type CheckAnalysisJSON_Results struct {
	ALYac        CheckAnalysisJSON_ALYac        `json:"ALYac"`
	Avast        CheckAnalysisJSON_Avast        `json:"Avast"`
	AvastMobile  CheckAnalysisJSON_AvastMobile  `json:"Avast-Mobile"`
	CATQuickHeal CheckAnalysisJSON_CATQuickHeal `json:"CAT-QuickHeal"`
	ClamAV       CheckAnalysisJSON_ClamAV       `json:"ClamAV"`
	Comodo       CheckAnalysisJSON_Comodo       `json:"Comodo"`
}
type CheckAnalysisJSON_Stats struct {
	ConfirmedTimeout int `json:"confirmed-timeout"`
	Failure          int `json:"failure"`
	Harmless         int `json:"harmless"`
	Malicious        int `json:"malicious"`
	Suspicious       int `json:"suspicious"`
	Timeout          int `json:"timeout"`
	TypeUnsupported  int `json:"type-unsupported"`
	Undetected       int `json:"undetected"`
}
type CheckAnalysisJSON_Attributes struct {
	Date    int                       `json:"date"`
	Results CheckAnalysisJSON_Results `json:"results"`
	Stats   CheckAnalysisJSON_Stats   `json:"stats"`
	Status  string                    `json:"status"`
}
type CheckAnalysisJSON_Data struct {
	Attributes CheckAnalysisJSON_Attributes `json:"attributes"`
	ID         string                       `json:"id"`
	Type       string                       `json:"type"`
}
