// src/test/java/types/pnr-fixture.types.ts

export const FIXTURE_VERSION = '1.0.0' as const;

export type FlightType = 'OW' | 'RT';
export type TripDirection = 'OUTBOUND' | 'INBOUND';
export type TripShape = 'DIRECT' | 'SCALE';
export type WindowType = 'VC' | 'VO';
export type SegmentLifecycle = 'FREE' | 'RESERVED' | 'IN_USE' | 'USED' | 'FLOWN' | 'OUT_OF_DATE' | 'BLOCKED';
export type SegmentStatus = 'SCHEDULED' | 'DELAYED' | 'CANCELLED' | 'DEPARTED' | 'ARRIVED';
export type PassengerType = 'ADT' | 'CHD' | 'INF' | 'YTH' | 'SRC';
export type PaymentMethod = 'CARD' | 'VOUCHER' | 'MIXED' | 'CASH' | 'MILES';
export type AddOnType = 'BAGGAGE' | 'SPECIAL_BAGGAGE' | 'SEAT' | 'PET' | 'MEAL' | 'FAST_TRACK' | 'LOUNGE' | 'INSURANCE';
export type DisruptionType = 'UN' | 'UNTK' | 'FLCH' | 'FLXX' | 'DELAY' | 'MISCONNECTION' | 'CANCELLATION';
export type DisruptionStatus = 'APPLIED' | 'PENDING' | 'FAILED' | 'ROLLED_BACK';
export type MockStatus = 'APPLIED' | 'PENDING' | 'FAILED';
export type MockEnvironment = 'INT' | 'PRE';
export type TicketStatus = 'ISSUED' | 'USED' | 'REFUNDED' | 'VOID' | 'EXCHANGED';
export type CarrierGroup = 'IB_GROUP' | 'PARTNER' | 'OTHER';
export type Locale = 'es' | 'ca' | 'en' | 'fr' | 'de' | 'it' | 'nl' | 'ru' | 'ja' | 'zh' | 'pt';
