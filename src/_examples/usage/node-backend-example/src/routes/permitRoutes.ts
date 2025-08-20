import { Router } from 'express';
import { validatePermit } from '../services/permitService';
import { validatePermitRequest } from '../middleware/validation';

const router = Router();

// Validate a single permit application
router.post('/validate', validatePermitRequest, async (req, res, next) => {
  try {
    const permitData = req.body;
    console.log('Permit validation requested', {
      permitType: permitData.permitType,
    });

    const result = await validatePermit(permitData);

    console.log('Permit validation completed', {
      violations: result.violations.length,
      warnings: result.warnings.length,
      cost: result.cost.length,
    });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Validate multiple permit applications (bulk validation)
router.post('/validate/bulk', async (req, res, next) => {
  try {
    const { permits } = req.body;

    if (!Array.isArray(permits)) {
      res.status(400).json({
        success: false,
        error: 'Invalid request body. Expected array of permits.',
      });
      return;
    }

    console.log('Bulk permit validation requested', { count: permits.length });

    const results = await Promise.allSettled(
      permits.map((permit) => validatePermit(permit)),
    );

    const processedResults = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return {
          index,
          success: true,
          data: result.value,
        };
      } else {
        return {
          index,
          success: false,
          error: result.reason.message,
        };
      }
    });

    console.log('Bulk permit validation completed', {
      total: permits.length,
      successful: processedResults.filter((r) => r.success).length,
    });

    res.json({
      success: true,
      data: processedResults,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Get available permit types
router.get('/types', (req, res, next) => {
  try {
    const permitService = require('../services/permitService');
    const permitTypes = permitService.getPermitTypes();

    res.json({
      success: true,
      data: Array.from(permitTypes.entries()),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Get available vehicle types
router.get('/vehicles', (req, res, next) => {
  try {
    const permitService = require('../services/permitService');
    const powerUnits = permitService.getPowerUnitTypes();
    const trailers = permitService.getTrailerTypes();

    res.json({
      success: true,
      data: {
        powerUnits: Array.from(powerUnits.entries()),
        trailers: Array.from(trailers.entries()),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Get policy configuration
router.get('/config', (req, res, next) => {
  try {
    const policyConfig = require('../config/_current-config.json');

    res.json({
      success: true,
      data: policyConfig,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export const permitRoutes = router;
