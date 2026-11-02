# Payment Outage Postmortem - March 2026

## Incident Summary

**Date:** March 15, 2026
**Duration:** 2 hours 15 minutes
**Severity:** P1 - Revenue Impact
**Fix:** PR #1

## What Happened

On March 15, 2026, between 14:00 and 16:15 UTC, approximately 12% of payment attempts failed due to transient network timeouts from our card processing provider. Customers saw "Payment failed" errors even though their cards were valid and had sufficient funds.

## Root Cause

Our `chargeCard()` function made a single attempt to contact the card network. When the network experienced brief connectivity issues (50-200ms blips), the request would fail and we would immediately return an error to the customer.

The card network provider confirmed these were transient issues that would succeed on retry in 99.7% of cases.

## Impact

- ~2,400 failed payment attempts
- Estimated $180,000 in lost revenue
- 340 customer support tickets
- 15 negative social media mentions

## Resolution

Added retry logic with exponential backoff to `chargeCard()`:
- Up to 3 retry attempts
- Exponential backoff: 100ms, 200ms, 400ms
- Only retries on network-level failures, not card declines

See PR #1: fix: retry card charges on network timeout

## Lessons Learned

1. **Always retry idempotent operations** - Card charges with unique transaction IDs are safe to retry
2. **Exponential backoff prevents thundering herd** - The 100/200/400ms delays were tuned with our provider
3. **Monitor retry rates** - Added alerting when retry rate exceeds 5%

## Action Items

- [x] Add retry logic to chargeCard (PR #1)
- [x] Add monitoring for card network latency
- [ ] Review other network calls for similar issues
- [ ] Establish retry policy guidelines for all external API calls

## Timeline

- 14:00 - Card network begins experiencing intermittent issues
- 14:15 - Monitoring alerts on elevated payment failure rate
- 14:30 - On-call engineer begins investigation
- 15:00 - Root cause identified as transient network timeouts
- 15:30 - Retry logic implemented and tested
- 16:00 - Fix deployed to production
- 16:15 - Payment success rate returns to normal
