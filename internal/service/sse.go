package service

import "sync"

var broker *Broker

type Event interface{}

type Broker struct {
	mu          sync.Mutex
	subscribers map[chan Event]struct{}
}

func GetBrokerInstance() *Broker {
	if broker == nil {
		broker = &Broker{subscribers: make(map[chan Event]struct{})}
	}
	return broker
}

func (b *Broker) Subscribe() chan Event {
	ch := make(chan Event, 10)
	b.mu.Lock()
	defer b.mu.Unlock()
	b.subscribers[ch] = struct{}{}
	return ch
}

func (b *Broker) Unsubscribe(ch chan Event) {
	b.mu.Lock()
	defer b.mu.Unlock()
	delete(b.subscribers, ch)
	close(ch)
}

func (b *Broker) Broadcast(event Event) {
	b.mu.Lock()
	defer b.mu.Unlock()
	for ch := range b.subscribers {
		select {
		case ch <- event:
		default:
			go b.Unsubscribe(ch)
		}
	}
}
