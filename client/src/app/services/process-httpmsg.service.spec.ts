import { TestBed } from '@angular/core/testing';

import { ProcessHttpMsgService } from './process-httpmsg.service';

describe('ProcessHttpMsgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcessHttpMsgService = TestBed.get(ProcessHttpMsgService);
    expect(service).toBeTruthy();
  });
});
