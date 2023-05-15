export interface EssayEntry {
	title: string;
	topic: string;
	wordCount?: bigint;
	reviewTimes?: number;
	essayCost: bigint;
	text: string;
}

export type UserEntry = {
	userName: string;
	myEssays: [bigint];
	pastRatedFeedbacks: [bigint];
	userRating: bigint;
	reviewingEssay: bigint;
	token_balance: bigint;
	createdAt: bigint;
};
