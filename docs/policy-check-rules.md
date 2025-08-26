# Policy Check Rules Documentation

This document explains the vehicle configuration validation rules used by the OnRouteBC Policy Engine. These rules are applied when the `runAxleCalculation` method is called to validate vehicle configurations for permit applications.

## Overview

The policy engine performs several validation checks on vehicle configurations to ensure compliance with British Columbia's commercial vehicle regulations. Each rule checks specific aspects of the vehicle setup and returns either a "pass" or "fail" result.

## Rule 1: Bridge Formula Check

**What it does:** Validates that axle groups don't exceed weight limits based on the distance between axles.

**How it works:** The bridge formula is a provincial regulation that limits the weight a group of axles can carry based on how far apart they are.

**What it checks:**
- Calculates the maximum allowed weight for each possible group of axles
- Compares the actual weight on each axle group against the calculated limit
- Ensures no axle group exceeds its bridge formula limit

**Example:** A truck with axles 1.8 meters apart might be limited to 12,000 kg, while axles 4.2 meters apart could carry up to 34,000 kg.

## Rule 2: Number of Wheels Per Axle Check

**What it does:** Ensures each axle unit has a valid number of tires.

**How it works:** Each axle must have either 2, 4, or 8 tires per axle. This rule multiplies the number of axles by these valid tire counts.

**What it checks:**
- For each axle unit, calculates valid tire counts: (number of axles × 2), (number of axles × 4), or (number of axles × 8)
- Validates that the actual tire count matches one of these calculations
- Verifies that the applicant has not mis-entered the number of wheels

**Example:** A 2-axle unit can have 4, 8, or 16 tires. A 3-axle unit can have 6, 12, or 24 tires.

## Rule 3: Permittable Weight Check

**What it does:** Validates that each axle unit's weight doesn't exceed the maximum allowed weight for that vehicle type and axle configuration.

**How it works:** Different vehicle types and axle configurations have different weight limits. This rule looks up the appropriate limits in the policy configuration and compares them to actual weights.

**What it checks:**
- For power units: Checks steer axle and drive axle weights separately
- For trailers: Checks trailer axle unit weights
- Compares actual weights against the maximum permittable weights for each axle unit
- Ensures no axle unit exceeds its permittable weight limit

**Example:** A truck-tractor with 2-axle steer and 3-axle drive might have different weight limits for each axle unit based on the vehicle type.

## Rule 4: Minimum Steer Axle Weight Check

**What it does:** Ensures the front (steer) axle carries enough weight.

**How it works:** For vehicles with a single steer axle and a tridem (3-axle) drive axle, the steer axle must carry at least 27% of the drive axle weight.

**What it checks:**
- Only applies to vehicles with 1 steer axle and 3 drive axles
- Calculates 27% of the drive axle weight
- Ensures the steer axle weight meets or exceeds this minimum

**Example:** If the drive axle carries 30,000 kg, the steer axle must carry at least 8,100 kg (27% of 30,000).

## Rule 5: Minimum Drive Axle Weight Check

**What it does:** Ensures drive axles carry enough weight.

**How it works:** Drive axles must carry at least 20% of the total vehicle weight (GVCW), but not more than specific maximum limits.

**What it checks:**
- For tandem (2-axle) drive: Minimum 20% of GVCW or 23,000 kg (whichever is smaller)
- For tridem (3-axle) drive: Minimum 20% of GVCW or 28,000 kg (whichever is smaller)
- Only applies to tandem or tridem drive configurations

**Example:** For a 120,000 kg vehicle with tandem drive, the drive axle must carry at least 23,000 kg, since this value is lower than 20% of the GVCW (24,000 kg).

## Rule 6: Maximum Tire Load Check

**What it does:** Validates that tires aren't overloaded based on their size and quantity.

**How it works:** Different tire sizes have different load capacities. This rule calculates the maximum weight each tire can safely carry and ensures the axle weight doesn't exceed this limit.

**What it checks:**

**For steer axles:**
- Tire size must not exceed 455mm
- For tires ≥445mm: Maximum weight is 9,100 kg
- For tires <445mm: Maximum weight = (number of tires × tire size × 10)

**For non-steer axles:**
- For tires ≥445mm: Maximum weight = (number of tires × 3,850 kg)
- For tires >300mm and <445mm: Maximum weight = (number of tires × 3,000 kg)
- For tires ≤300mm: Maximum weight = (number of tires × tire size × 10)

**Example:** A steer axle with 2 tires of 445mm can carry up to 9,100 kg. A drive axle with 8 tires of 445mm can carry up to 30,800 kg (8 × 3,850).

## How These Rules Work Together

When you call the `runAxleCalculation` method, all six rules are automatically applied to your vehicle configuration. The method returns:

1. **Individual results** for each rule that was checked
2. **Pass/fail status** for each validation
3. **Detailed messages** explaining why a rule passed or failed
4. **Total overload calculation** comparing actual weight to licensed weight

## Example Usage

```typescript
const results = policy.runAxleCalculation(
  ['TRKTRAC', 'SEMITRL'],  // Vehicle configuration
  [
    { numberOfAxles: 2, axleUnitWeight: 12000, numberOfTires: 4, tireSize: 445 },  // Steer axle
    { numberOfAxles: 3, axleUnitWeight: 34000, numberOfTires: 12, tireSize: 445 }, // Drive axle
    { numberOfAxles: 3, axleUnitWeight: 34000, numberOfTires: 12, tireSize: 445 }  // Trailer axle
  ],
  63500  // Licensed GVW
);
```

This will return results for all six policy checks, indicating whether each aspect of the vehicle configuration complies with BC regulations.

## Compliance Requirements

All rules must pass for a vehicle configuration to be considered compliant with BC commercial vehicle regulations. If any rule fails, the vehicle configuration may need to be adjusted before a permit can be issued.
