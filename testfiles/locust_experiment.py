from locust import HttpLocust, TaskSet, task, events, web
import time
import csv


def index(l):
    l.client.get("/")

class ExperimentTaskSet(TaskSet):
    tasks = [index]


class Experiment(HttpLocust):
    host = "http://www.example.com"
    result_file = "locust_experiment_result.csv"
    min_wait = 1000
    max_wait = 2000
    task_set = ExperimentTaskSet
    header = ["timeStamp", "service", "type", "success", "responseTime", "bytes"]
    footer = ["http://www.example.com"]
    data = []

    def __init__(self):
        super(MyLocust, self).__init__()
        events.request_success += self.save_succ
        events.request_failure += self.save_fail
        events.quitting += self.write

    def save_succ(self, request_type, name, response_time, response_length):
        self.save(request_type, name, response_time, response_length, 1)

    def save_fail(self, request_type, name, response_time):
        self.save(request_type, name, response_time, 0, 0)

    def save(self, request_type, name, response_time, response_length, success):
        self.data.append([int(round(time.time() * 1000)), name, request_type, success, response_time, response_length])

    def write(self):
        with open(self.result_file, 'wb') as csv_file:
            csv_file.write(",".join(self.header) + "\n")
            for value in self.data:
                csv_file.write(",".join(str(x) for x in value) + "\n")
            csv_file.write(",".join(self.footer) + "\n")
