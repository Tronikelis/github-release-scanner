package time_queue

import (
	"sync/atomic"
	"time"
)

type TimeQueueThrottled struct {
	per time.Duration

	count *atomic.Uint64
	max   uint
}

func New(per time.Duration, max uint) TimeQueueThrottled {
	count := atomic.Uint64{}

	go func() {
		for {
			time.Sleep(per)
			count.Store(0)
		}
	}()

	return TimeQueueThrottled{
		count: &count,
		per:   per,
		max:   max,
	}
}

// returns a bool indicating if the time queue accepted this use
func (timeQueue *TimeQueueThrottled) TryUse() bool {
	if timeQueue.isThrottled() {
		return false
	}

	timeQueue.count.Add(1)
	return true
}

// use this if the queue is not accepting tasks and after waiting try again
func (timeQueue *TimeQueueThrottled) Wait() {
	time.Sleep(timeQueue.per + time.Second*10)
}

// combines `TryUse` and `Wait` to wait until we can do this task
func (timeQueue *TimeQueueThrottled) TryAndWait() {
	for !timeQueue.TryUse() {
		timeQueue.Wait()
	}
}

func (timeQueue *TimeQueueThrottled) isThrottled() bool {
	return uint(timeQueue.count.Load()) >= timeQueue.max
}
