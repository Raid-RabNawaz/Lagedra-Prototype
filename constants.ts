
import { Listing, User, VerificationClass, InsuranceStatus, ConfidenceLevel, Deal, DealStatus, OpsQueueItem, Inquiry, ListingStatus, ArbitrationCase } from './types';

export const MOCK_USER_TENANT: User = {
  id: 't1',
  name: 'Dr. Sarah Chen',
  email: 'sarah.chen@med.ucsf.edu',
  phone: '+1 (415) 555-0123',
  bio: 'Cardiothoracic Surgery Resident at UCSF. Looking for quiet, clean environments for 3-6 month rotations.',
  role: 'tenant',
  verificationClass: VerificationClass.LOW_RISK,
  insuranceStatus: InsuranceStatus.INSTITUTION_BACKED,
  confidence: ConfidenceLevel.HIGH,
  verifiedAffiliation: 'UCLA Health (Verified)',
  avatarUrl: 'https://picsum.photos/id/64/100/100',
  tenantVerification: {
    identity: true,
    income: true,
    background: false, // Partially verified for demo purposes
    rentalHistory: true
  },
  savedListingIds: ['102'], // Added mock saved listing
  trustLedger: [
    { id: 'l1', date: '2023-10-15', type: 'Deal Completed', description: '90-day stay completed without incident.' },
    { id: 'l2', date: '2023-11-01', type: 'Active Month', description: 'Protocol fee paid, no violations.' }
  ]
};

export const MOCK_USER_LANDLORD: User = {
  id: 'l1',
  name: 'Urban Properties LLC',
  role: 'landlord',
  verificationClass: VerificationClass.LOW_RISK,
  insuranceStatus: InsuranceStatus.ACTIVE,
  confidence: ConfidenceLevel.HIGH,
  avatarUrl: 'https://picsum.photos/id/55/100/100',
  hostVerification: {
    govtId: true,
    liveness: true,
    businessKyc: false, // Pending
    homeAddress: true
  },
  trustLedger: [
    { id: 'la1', date: '2023-08-01', type: 'Deal Completed', description: 'Successful protocol closure.' }
  ]
};

export const MOCK_USER_ARBITRATOR: User = {
  id: 'arb1',
  name: 'Hon. J. Dredd (Ret.)',
  role: 'arbitrator',
  avatarUrl: 'https://ui-avatars.com/api/?name=Judge+Dredd&background=1e293b&color=fff',
  trustLedger: []
};

export const MOCK_USER_ADMIN: User = {
  id: 'adm1',
  name: 'Ops Admin Alpha',
  role: 'admin',
  avatarUrl: 'https://ui-avatars.com/api/?name=Admin+Ops&background=0f172a&color=fff',
  trustLedger: []
};

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '101',
    title: 'Modern Loft in Arts District',
    description: 'Experience the vibrant Arts District in this fully furnished modern loft. Featuring exposed brick walls, 12ft ceilings, and oversized windows, this space is perfect for creative professionals. The building offers a rooftop lounge with skyline views and a state-of-the-art gym. Located just steps from top-rated coffee shops and galleries.',
    status: ListingStatus.ACTIVE,
    location: { city: 'Los Angeles', state: 'CA', zip: '90013', approximate: true },
    priceDisplay: 3200,
    depositGuidance: { min: 500, max: 3200, recommended: 800 }, // Low due to verification
    details: { bedrooms: 1, bathrooms: 1, sqft: 850, furnished: true, utilitiesIncluded: true },
    amenities: ['High-Speed WiFi', 'Air Conditioning', 'Washer/Dryer', 'Smart Lock', 'Gym Access'],
    accessibility: ['Step-free guest entrance', 'Elevator', 'Wide doorways'],
    requirements: {
      minCreditScore: 680,
      incomeMultiplier: 3.0,
      smokingAllowed: false,
      petsAllowed: false
    },
    imageUrl: 'https://picsum.photos/id/129/800/600',
    hostId: 'l1',
    verificationStatus: {
      photoMatch: true,
      videoTour: true,
      documents: true,
      mailCode: false,
      gpsMatch: true
    }
  },
  {
    id: '102',
    title: 'Executive Suite near Medical Center',
    description: 'Ideally situated for medical residents and traveling nurses, this executive suite offers a quiet retreat just 5 minutes from UCSF Medical Center. The unit features blackout curtains for night shift workers, a dedicated home office with ergonomic seating, and high-speed fiber internet. Weekly housekeeping is included to make your busy life easier.',
    status: ListingStatus.ACTIVE,
    location: { city: 'San Francisco', state: 'CA', zip: '94143', approximate: true },
    priceDisplay: 4500,
    depositGuidance: { min: 1000, max: 4500, recommended: 1200 },
    details: { bedrooms: 2, bathrooms: 2, sqft: 1100, furnished: true, utilitiesIncluded: true },
    amenities: ['Gigabit Fiber', 'Dedicated Workspace', 'Parking', 'Doorman', 'Weekly Cleaning'],
    accessibility: ['Elevator', 'Step-free shower'],
    requirements: {
      minCreditScore: 720,
      incomeMultiplier: 2.5,
      smokingAllowed: false,
      petsAllowed: true
    },
    imageUrl: 'https://picsum.photos/id/188/800/600',
    hostId: 'l2',
    verificationStatus: {
      photoMatch: true,
      videoTour: false,
      documents: false,
      mailCode: false,
      gpsMatch: true
    }
  },
  {
    id: '103',
    title: 'Quiet Bungalow for Remote Work',
    description: 'Escape to Austin in this charming, renovated bungalow. Tucked away in a peaceful neighborhood, this home offers a large private backyard and a screened-in porch perfect for morning coffee. The interior is designed for productivity with a standing desk setup and mesh WiFi system ensuring coverage throughout the property.',
    status: ListingStatus.OCCUPIED,
    location: { city: 'Austin', state: 'TX', zip: '78704', approximate: true },
    priceDisplay: 2800,
    depositGuidance: { min: 0, max: 2800, recommended: 500 },
    details: { bedrooms: 2, bathrooms: 1, sqft: 1200, furnished: true, utilitiesIncluded: false },
    amenities: ['Backyard', 'High-Speed WiFi', 'Pet Friendly', 'Off-street Parking'],
    accessibility: ['Step-free guest entrance', 'Single level home'],
    requirements: {
      minCreditScore: 650,
      incomeMultiplier: 3.0,
      smokingAllowed: false,
      petsAllowed: true
    },
    imageUrl: 'https://picsum.photos/id/238/800/600',
    hostId: 'l3',
    verificationStatus: {
      photoMatch: false,
      videoTour: false,
      documents: false,
      mailCode: false,
      gpsMatch: false
    }
  }
];

export const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 'inq_1',
    listingId: '101',
    tenantId: 't1',
    tenantName: 'Dr. Sarah Chen',
    topic: 'Internet Speed',
    question: 'Is the internet connection fiber or cable? I need high upload speeds.',
    answer: 'It is AT&T Fiber, 1Gbps symmetric.',
    status: 'answered',
    timestamp: '2024-02-10 09:00'
  },
  {
    id: 'inq_2',
    listingId: '101',
    tenantId: 't2', // Another tenant
    tenantName: 'John Doe',
    topic: 'Parking',
    question: 'Is the parking spot covered?',
    status: 'pending',
    timestamp: '2024-02-14 14:30'
  }
];

export const MOCK_ACTIVE_DEAL: Deal = {
  id: 'd_123',
  listingId: '101',
  tenantId: 't1',
  landlordId: 'l1',
  status: DealStatus.ACTIVE,
  startDate: '2024-02-01',
  endDate: '2024-05-01',
  protocolFeeStatus: 'Current',
  truthSurface: [
    { category: 'Terms', key: 'Monthly Rate', value: '$3,200', confirmed: true },
    { category: 'Terms', key: 'Deposit', value: '$800', confirmed: true },
    { category: 'Included', key: 'Utilities', value: 'Water, Trash, Internet (500Mbps)', confirmed: true },
    { category: 'Included', key: 'Furnishings', value: 'Full', confirmed: true },
    { category: 'Rules', key: 'Pets', value: 'No pets allowed', confirmed: true },
    { category: 'Rules', key: 'Guests', value: 'Max 2 overnight guests', confirmed: true },
    { category: 'Condition', key: 'Move-in Photos', value: 'Uploaded (24 items)', confirmed: true },
    { category: 'Insurance', key: 'Tenant Policy', value: 'Verified (Assurant)', confirmed: true },
  ],
  truthSnapshotHash: '0x8f2d...3a1b',
  truthSignature: 'sig_rsa_4096_...'
};

export const MOCK_DISPUTE_DEAL: Deal = {
  id: 'd_999',
  listingId: '103',
  tenantId: 't1',
  landlordId: 'l3',
  status: DealStatus.DISPUTE, // Updated to DISPUTE for better demo flow
  startDate: '2024-01-15',
  endDate: '2024-04-15',
  protocolFeeStatus: 'Current',
  truthSurface: [
    { category: 'Terms', key: 'Monthly Rate', value: '$2,800', confirmed: true },
    { category: 'Condition', key: 'HVAC', value: 'Central AC / Heating Functional', confirmed: true },
    { category: 'Condition', key: 'Noise Level', value: 'Residential Quiet Zone', confirmed: true },
    { category: 'Included', key: 'Internet', value: 'Fiber 1Gbps', confirmed: true },
  ],
  truthSnapshotHash: '0x1a2b...99c1',
  truthSignature: 'sig_rsa_4096_...'
};

export const MOCK_ARBITRATION_CASES: ArbitrationCase[] = [
    {
        id: 'arb_8821',
        dealId: 'd_999',
        disputeType: 'Habitability: HVAC',
        status: 'Open',
        createdDate: '2024-10-15',
        deadline: '2024-10-24',
        claimantId: 't1',
        respondentId: 'l3',
        claimSummary: 'Tenant claims AC unit failed for 4 consecutive days with temps > 85F. Truth Surface guarantees "Functional HVAC". Landlord unresponsive.',
        relevantTruthKey: 'Condition.HVAC',
        escrowAmount: 2800,
        evidence: [
            {
                id: 'ev_1',
                submittedBy: 'tenant',
                type: 'Image',
                filename: 'thermostat_log_oct15.jpg',
                description: 'Photo of thermostat reading 87F at 2PM.',
                timestamp: '2024-10-15 14:02',
                hash: '0xe2...4a',
                verifiedMetadata: true
            },
            {
                id: 'ev_2',
                submittedBy: 'tenant',
                type: 'Log',
                filename: 'nest_data_export.json',
                description: 'Raw data export from smart thermostat showing compressor inactivity.',
                timestamp: '2024-10-16 09:00',
                hash: '0x99...b2',
                verifiedMetadata: true
            },
            {
                id: 'ev_3',
                submittedBy: 'landlord',
                type: 'Document',
                filename: 'hvac_service_record_sep.pdf',
                description: 'Maintenance record from September showing unit passed inspection.',
                timestamp: '2024-10-17 11:30',
                hash: '0x1a...f5',
                verifiedMetadata: true
            }
        ]
    },
    {
        id: 'arb_8825',
        dealId: 'd_124',
        disputeType: 'Cancellation: Early Termination',
        status: 'Reviewing',
        createdDate: '2024-10-18',
        deadline: '2024-10-27',
        claimantId: 'l1',
        respondentId: 't2',
        claimSummary: 'Landlord claiming early termination fee. Tenant cites military reassignment clause.',
        relevantTruthKey: 'Terms.Cancellation',
        escrowAmount: 1500,
        evidence: []
    }
];

export const MOCK_OPS_QUEUE: OpsQueueItem[] = [
  {
    id: 'ops_1',
    type: 'Insurance Unknown',
    severity: 'High',
    created: '2024-02-14 08:30:00',
    deadline: '24h',
    description: 'Partner API outage returned Unknown for Tenant T1. 72h grace window active.',
    status: 'Open'
  },
  {
    id: 'ops_2',
    type: 'Tenant Verification',
    severity: 'High',
    created: '2024-02-14 09:15:00',
    deadline: '4h',
    description: 'Manual identity review required. AI Flag: "Name mismatch confidence 40%".',
    status: 'Open'
  },
  {
    id: 'ops_3',
    type: 'Host Verification',
    severity: 'Medium',
    created: '2024-02-14 10:00:00',
    deadline: '12h',
    description: 'Business KYC documents pending for "Urban Properties LLC". Verify beneficial ownership.',
    status: 'Open'
  },
  {
    id: 'ops_4',
    type: 'Property Verification',
    severity: 'Medium',
    created: '2024-02-13 16:45:00',
    deadline: '24h',
    description: 'Photo Match Variance > 10m. Review GPS metadata and visual similarity manually.',
    status: 'In Progress'
  }
];
