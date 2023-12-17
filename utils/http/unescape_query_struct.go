package http

import (
	"errors"
	"net/url"
	"reflect"
)

func UnescapeQueryStruct(itf interface{}) error {
	val := reflect.ValueOf(itf)

	if val.Kind() != reflect.Ptr || val.Elem().Kind() != reflect.Struct {
		return errors.New("pointer required")
	}

	val = val.Elem()

	for i := 0; i < val.NumField(); i++ {
		field := val.Field(i)
		if field.Kind() != reflect.String {
			continue
		}

		decoded, err := url.QueryUnescape(field.String())
		if err != nil {
			return err
		}

		field.Set(reflect.ValueOf(decoded))
	}

	return nil
}
