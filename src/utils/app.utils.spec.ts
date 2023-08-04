import { CardStatistics } from '../app-types';
import { getOwnersByCardStatistics } from './app.utils';

describe('AppUtils', () => {
  it('should return the correct value for getOwnersByCardStatistics with null as CardsStatistic', () => {
    const cards = [
      { id: '1', owner: 'a' },
      { id: '1', owner: 'a' },
      { id: '2', owner: 'a' },
      { id: '3', owner: 'b' },
      { id: '3', owner: 'b' },
      { id: '3', owner: 'b' },
      { id: '4', owner: 'b' },
      { id: '4', owner: 'b' },
      { id: '5', owner: 'b' },
    ];
    const owners = ['a', 'b'];
    expect(getOwnersByCardStatistics({ cards, type: null })).toEqual(owners);
  });
  it('should return the correct value for getOwnersByCardStatistics with TOTAL_CARDS', () => {
    const cards = [
      { id: '1', owner: 'a' },
      { id: '1', owner: 'a' },
      { id: '2', owner: 'a' },
      { id: '3', owner: 'b' },
      { id: '3', owner: 'b' },
      { id: '3', owner: 'b' },
      { id: '4', owner: 'b' },
      { id: '4', owner: 'b' },
      { id: '5', owner: 'b' },
    ];
    const type = CardStatistics.TOTAL_CARDS;
    const owners = ['a', 'a', 'a', 'b', 'b', 'b', 'b', 'b', 'b'];
    expect(getOwnersByCardStatistics({ cards, type })).toEqual(owners);
  });

  it('should return the correct value for getOwnersByCardStatistics with UNIQUE_CARDS', () => {
    const cards = [
      { id: '1', owner: 'a' },
      { id: '1', owner: 'a' },
      { id: '2', owner: 'a' },
      { id: '3', owner: 'b' },
      { id: '3', owner: 'b' },
      { id: '3', owner: 'b' },
      { id: '4', owner: 'b' },
      { id: '4', owner: 'b' },
      { id: '5', owner: 'b' },
    ];
    const type = CardStatistics.UNIQUE_CARDS;
    const owners = ['a', 'a', 'b', 'b', 'b'];
    expect(getOwnersByCardStatistics({ cards, type })).toEqual(owners);
  });
});
