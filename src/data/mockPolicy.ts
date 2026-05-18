export const mockPolicy = {
  policyNumber: 'POL-2022-48291',
  status: 'Active' as const,
  effectiveDate: '2022-03-15',
  expirationDate: '2026-03-15',
  renewalDate: '2026-03-15',

  namedInsured: {
    name: 'Alex Johnson',
    address: '1427 Maple Street, San Francisco, CA 94103',
    phone: '(415) 555-0182',
    email: 'alex.johnson@email.com',
  },

  agent: {
    name: 'Maria Santos',
    office: 'Pacific Coast Insurance Group',
    phone: '(415) 555-0100',
    email: 'msantos@pacificcoastins.com',
    address: '500 Market St, Suite 1200, San Francisco, CA 94105',
  },

  vehicles: [
    {
      year: 2025,
      make: 'Honda',
      model: 'Civic LX',
      trim: 'LX',
      color: 'Black',
      vin: '2HGFE2F56RH408421',
    },
    {
      year: 2024,
      make: 'Tesla',
      model: 'Model 3',
      trim: 'Standard Range RWD',
      color: 'Silver',
      vin: '5YJ3E1EA0RF123456',
    },
  ],

  drivers: [
    {
      name: 'Alex Johnson',
      dateOfBirth: '1988-07-22',
      licenseNumber: 'CA-D4921830',
      licenseState: 'CA',
      relation: 'Primary',
    },
  ],

  coverages: [
    {
      vehicle: '2025 Honda Civic LX',
      type: 'Comprehensive',
      description: 'Covers damage from non-collision events (theft, weather, fire)',
      limit: 'Actual Cash Value',
      deductible: '$500',
    },
    {
      vehicle: '2025 Honda Civic LX',
      type: 'Collision',
      description: 'Covers damage from collisions with other vehicles or objects',
      limit: 'Actual Cash Value',
      deductible: '$500',
    },
    {
      vehicle: '2025 Honda Civic LX',
      type: 'Bodily Injury Liability',
      description: 'Covers injuries to others in an accident you cause',
      limit: '$100,000 / $300,000',
      deductible: 'None',
    },
    {
      vehicle: '2025 Honda Civic LX',
      type: 'Property Damage Liability',
      description: 'Covers damage to others\' property in an accident you cause',
      limit: '$100,000',
      deductible: 'None',
    },
    {
      vehicle: '2024 Tesla Model 3',
      type: 'Comprehensive',
      description: 'Covers damage from non-collision events (theft, weather, fire)',
      limit: 'Actual Cash Value',
      deductible: '$750',
    },
    {
      vehicle: '2024 Tesla Model 3',
      type: 'Collision',
      description: 'Covers damage from collisions with other vehicles or objects',
      limit: 'Actual Cash Value',
      deductible: '$750',
    },
    {
      vehicle: '2024 Tesla Model 3',
      type: 'Bodily Injury Liability',
      description: 'Covers injuries to others in an accident you cause',
      limit: '$100,000 / $300,000',
      deductible: 'None',
    },
    {
      vehicle: '2024 Tesla Model 3',
      type: 'Property Damage Liability',
      description: 'Covers damage to others\' property in an accident you cause',
      limit: '$100,000',
      deductible: 'None',
    },
  ],

  deductibleSummary: {
    annualOutOfPocketMax: 3000,
    outOfPocketUsed: 500,
    outOfPocketRemaining: 2500,
  },
};
