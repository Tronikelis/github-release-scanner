package req

import (
	"errors"
	"net/url"
	"reflect"

	"github.com/labstack/echo/v4"
)

func unescapeQueryStruct[T any](itf *T) error {
	val := reflect.ValueOf(itf)

	if val.Elem().Kind() != reflect.Struct {
		return errors.New("struct required")
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

func BindAndUnescape[T any](c echo.Context, obj *T) error {
	if err := c.Bind(obj); err != nil {
		return err
	}

	if err := unescapeQueryStruct(obj); err != nil {
		return err
	}

	return nil
}
