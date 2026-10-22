
// src/test/java/types/pnr-fixture.types.ts

export const FIXTURE_VERSION = '1.2.0' as const;

// ---------- Enums ----------
export type FlightType       = 'OW' | 'RT';
export type TripDirection    = 'OUTBOUND' | 'INBOUND';
export type TripShape        = 'DIRECT' | 'SCALE';
export type WindowType       = 'VC' | 'VO';
export type SegmentLifecycle = 'FREE' | 'RESERVED' | 'IN_USE' | 'USED' | 'FLOWN' | 'OUT_OF_DATE' | 'BLOCKED';
export type SegmentStatus    = 'SCHEDULED' | 'DELAYED' | 'CANCELLED' | 'DEPARTED' | 'ARRIVED';
export type PassengerType    = 'ADT' | 'CHD' | 'INF' | 'YTH' | 'SRC';
export type PaymentMethod    = 'CARD' | 'VOUCHER' | 'MIXED' | 'CASH' | 'MILES';
export type AddOnType        = 'BAGGAGE' | 'SPECIAL_BAGGAGE' | 'SEAT' | 'PET' | 'MEAL' | 'FAST_TRACK' | 'LOUNGE' | 'INSURANCE';
export type DisruptionType   = 'UN' | 'UNTK' | 'FLCH' | 'FLXX' | 'DELAY' | 'MISCONNECTION' | 'CANCELLATION';
export type DisruptionStatus = 'APPLIED' | 'PENDING' | 'FAILED' | 'ROLLED_BACK';
export type MockStatus       = 'APPLIED' | 'PENDING' | 'FAILED';
export type MockEnvironment  = 'INT' | 'PRE';
export type TicketStatus     = 'ISSUED' | 'USED' | 'REFUNDED' | 'VOID' | 'EXCHANGED';
export type CarrierGroup     = 'IB_GROUP' | 'PARTNER' | 'OTHER';
export type Locale           = 'es' | 'ca' | 'en' | 'fr' | 'de' | 'it' | 'nl' | 'ru' | 'ja' | 'zh' | 'pt';

// ---------- Root ----------
export interface PnrFixture {
  $schema: string;
  version: typeof FIXTURE_VERSION;
  generatedAt: string;
  generator: GeneratorInfo;
  filters?: PNRSelector[];
  stats: FixtureStats;
  pnrs: PNR[];
}

export interface GeneratorInfo {
  name: string;
  version: string;
  environment: 'INT' | 'PRE' | 'DEV';
  locale: Locale;
  hostname?: string;
  operator?: string;
  vpn?: { used: boolean; gateway?: string };
}

export interface FixtureStats {
  totalPnrs: number;
  totalPassengers: number;
  totalSegments: number;
  byFlightType: Record<FlightType, number>;
  byDisruptionType: Record<string, number>;
  byWindow: { VC: number; VO: number };
}

// ---------- PNR ----------
export interface PNR {
  pnrCode: string;
  orderId?: string;                              // ← NUEVO v1.2.0 (solo en modo real)
  createdAt: string;
  createdAtEnv: 'INT' | 'PRE';
  flightType: FlightType;
  tripShape: TripShape;
  passengerCount: number;
  segmentCount: number;
  passengers: Passenger[];
  trips: Trip[];
  payment: Payment;
  addOns: AddOn[];
  isCheckedIn: boolean;
  hasDisruption: boolean;
  disruptionTypes: DisruptionType[];
  mockedIn: MockEnvironment[];
  isFullyFlown: boolean;
  _flatSegments: FlatSegment[];
}

// ---------- Trip ----------
export interface Trip {
  tripId: string;
  direction: TripDirection;
  shape: TripShape;
  segments: Segment[];
}

// ---------- Segment ----------
export interface Segment {
  segmentId: string;
  tripId: string;
  segmentOrder: number;
  flightNumber: string;
  marketingCarrier: string;
  operatingCarrier: string;
  carrierGroup: CarrierGroup;
  isCodeshare: boolean;
  isOtherGroupAirline: boolean;
  aircraftType?: string;
  departure: AirportEvent;
  arrival: AirportEvent;
  cabinClass?: 'Y' | 'W' | 'J' | 'F';
  bookingClass?: string;
  status: SegmentStatus;
  lifecycleState: SegmentLifecycle;
  windowType: WindowType;
  hoursToDeparture: number;
  isFlown: boolean;
  isCheckedIn: boolean;
  checkIn: CheckInInfo;
  mock: MockInfo;
  disruption: Disruption | null;
  expectedMMB?: ExpectedMMBState;
}

export interface CheckInInfo {
  isEligible: boolean;
  isInternational: boolean;
  windowHours: 24 | 48;
  opensAt: string;
  closesAt: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
  checkedInByPassengerId?: string;
}

export interface AirportEvent {
  airportCode: string;
  airportName: string;
  cityCode?: string;
  cityName?: string;
  datetime: string;
  timezone: string;
  terminal?: string;
}

// ---------- Passenger ----------
export interface Passenger {
  passengerId: string;
  type: PassengerType;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  documentType?: 'DNI' | 'PASSPORT' | 'ID';
  documentNumber?: string;
  dateOfBirth?: string;
  frequentFlyer?: { program: string; number: string; tier?: string };
  ticket: Ticket;
  isCheckedIn: boolean;
  checkedInAt?: string;
  checkedInSegments?: string[];
  seat?: { segmentId: string; number: string; type?: 'WINDOW' | 'AISLE' | 'MIDDLE' };
  addOnIds?: string[];
}

export interface Ticket {
  ticketNumber: string;
  status: TicketStatus;
  issuedAt: string;
  issuedBy?: string;
  fareBasis?: string;
  currency?: string;
  amount?: number;
}

// ---------- Payment ----------
export interface Payment {
  method: PaymentMethod;
  currency: string;
  totalAmount: number;
}

// ---------- Add-ons ----------
export interface AddOn {
  addOnId: string;
  type: AddOnType;
  passengerId: string;
  segmentId?: string;
  detail?: Record<string, unknown>;
  price?: { amount: number; currency: string };
}

// ---------- Mock ----------
export interface MockInfo {
  int: MockDetail;
  pre: MockDetail;
}
export interface MockDetail {
  applied: boolean;
  status?: MockStatus;
  appliedAt?: string;
  mockId?: string;
}

// ---------- Disruption ----------
export interface Disruption {
  disruptionId: string;
  type: DisruptionType;
  segmentId: string;
  status: DisruptionStatus;
  appliedAt: string;
  appliedBy?: string;
  detail?: {
    newFlightNumber?: string;
    newDepartureDatetime?: string;
    delayMinutes?: number;
    reasonCode?: string;
    compensationOffered?: boolean;
    reaccommodationType?: 'SAME_DAY' | 'NEXT_DAY' | 'REFUND';
  };
}

// ---------- MMB ----------
export interface ExpectedMMBState {
  showDisruptionBanner: boolean;
  bannerText?: string;
  showNewFlight: boolean;
  showCompensation: boolean;
  showCheckInButton: boolean;
  allowSeatSelection: boolean;
  allowAddOns: boolean;
  showChangeFlightOption: boolean;
  showRefundOption: boolean;
  refundType?: 'VOUCHER' | 'CASH' | 'CARD' | 'NONE';
}

// ---------- Flat Segment ----------
export interface FlatSegment {
  segmentId: string;
  tripId: string;
  pnrCode: string;
  flightNumber: string;
  departureDatetime: string;
  windowType: WindowType;
  hoursToDeparture: number;
  isCheckedIn: boolean;
  isFlown: boolean;
  lifecycleState: SegmentLifecycle;
  disruptionType: DisruptionType | null;
  mockedIn: MockEnvironment[];
}

// ---------- Selector ----------
export interface PNRSelector {
  pnrCode?: string | string[];
  checkedIn?: boolean;
  checkInEligible?: boolean;
  hasDisruption?: boolean;
  disruptionType?: DisruptionType | DisruptionType[];
  mockedIn?: MockEnvironment[];
  mockedInAll?: MockEnvironment[];
  windowType?: WindowType;
  hoursToDepartureMin?: number;
  hoursToDepartureMax?: number;
  flightType?: FlightType;
  tripShape?: TripShape;
  segmentCount?: number | { min?: number; max?: number };
  passengerCount?: number | { min?: number; max?: number };
  segmentLifecycle?: SegmentLifecycle | SegmentLifecycle[];
  operatingCarrier?: string | string[];
  carrierGroup?: CarrierGroup;
  isInternational?: boolean;
  isOtherGroupAirline?: boolean;
  paymentMethod?: PaymentMethod;
  hasAddOn?: AddOnType | AddOnType[];
  locale?: Locale;
}
