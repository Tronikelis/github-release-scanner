package db

import (
	"github-release-scanner/context"
	"github-release-scanner/middleware/db/models"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type DbConfig struct {
	host     string
	user     string
	password string
	dbName   string
	port     uint
}

func (c DbConfig) getDsn() string {
	s := ""

	s += "host= " + c.host + " "
	s += "user= " + c.user + " "
	s += "password= " + c.password + " "
	s += "dbname= " + c.dbName + " "
	s += "port= " + strconv.Itoa(int(c.port)) + " "

	s += "sslmode=prefer "

	return s
}

func GetMiddleware() (*gorm.DB, func(next echo.HandlerFunc) echo.HandlerFunc) {
	dbPort, err := strconv.Atoi(os.Getenv("DB_PORT"))
	if err != nil {
		log.Fatalln(err)
	}

	dbConfig := DbConfig{
		host:     os.Getenv("DB_HOST"),
		user:     os.Getenv("DB_USER"),
		password: os.Getenv("DB_PASSWORD"),
		dbName:   os.Getenv("DB_DBNAME"),
		port:     uint(dbPort),
	}

	gorm, err := gorm.Open(postgres.Open(dbConfig.getDsn()))
	if err != nil {
		log.Fatalln(err)
	}

	sqlDB, err := gorm.DB()
	if err != nil {
		log.Fatalln(err)
	}

	sqlDB.SetMaxIdleConns(1)
	sqlDB.SetMaxOpenConns(10)
	sqlDB.SetConnMaxLifetime(time.Hour)

	gorm.AutoMigrate(models.Repository{}, models.Release{}, models.ReleaseAsset{})

	return gorm, func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.(*context.Context).Gorm = gorm
			return next(c)
		}
	}
}
