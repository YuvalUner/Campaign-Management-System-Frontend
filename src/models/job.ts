interface Job {
    jobGuid?: string;
    jobName?: string;
    jobDescription?: string;
    jobLocation?: string;
    jobStartTime?: Date;
    jobEndTime?: Date;
    jobDefaultSalary?: number;
    peopleNeeded?: number;
    peopleAssigned?: number;
    jobTypeName?: string;
}

export default Job;
