interface Ballot {
    cityName: string;
    innerCityBallotId: number;
    accessible: boolean;
    ballotAddress: string;
    ballotLocation: string;
    ballotId?: number;
    isCustomBallot?: boolean;
}

export default Ballot;
