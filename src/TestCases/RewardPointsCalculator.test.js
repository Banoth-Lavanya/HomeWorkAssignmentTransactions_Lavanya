import { calculateRewardPoints } from '../utils/calculateRewardPoints';

test('calculates reward points correctly', () => {
    expect(calculateRewardPoints("120.9")).toBe(90); 
    expect(calculateRewardPoints(100.2)).toBe(50); 
    expect(calculateRewardPoints(-50)).toBe(0);   
    expect(calculateRewardPoints(75000)).toBe( 149850);  
    expect(calculateRewardPoints(undefined)).toBe(0);
    expect(calculateRewardPoints(100)).toBe(50); 
});