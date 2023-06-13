interface Job {
    jobGuid?: string;
    jobName?: string;
    jobDescription?: string;
    jobLocation?: string;
    jobStartTime?: string;
    jobEndTime?: string;
    jobDefaultSalary?: number;
    peopleNeeded?: number;
    peopleAssigned?: number;
    jobTypeName?: string;
}

export default Job;
