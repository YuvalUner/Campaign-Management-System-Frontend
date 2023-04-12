interface Job {
    jobGuid: string;
    jobName: string;
    jobDescription: string | null;
    jobLocation: string | null;
    jobStartTime: Date | null;
    jobEndTime: Date | null;
    jobDefaultSalary: number | null;
    peopleNeeded: number | null;
    peopleAssigned: number | null;
    jobTypeName: string | null;
}

export default Job;
