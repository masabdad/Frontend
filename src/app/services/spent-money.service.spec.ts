import { TestBed } from '@angular/core/testing';

import { SpentMoneyService } from './spent-money.service';

describe('SpentMoneyService', () => {
  let service: SpentMoneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpentMoneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
