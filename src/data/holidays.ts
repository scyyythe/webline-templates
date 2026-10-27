export type HolidayType = 'regular' | 'special'

export interface PhilippineHoliday {
  date: string
  name: string
  type: HolidayType
}

// Verify dates, especially lunar holidays, against the official proclamation each year.
export const philippineHolidays: PhilippineHoliday[] = [
  { date: '2026-01-01', name: 'New Year’s Day', type: 'regular' },
  { date: '2026-02-17', name: 'Chinese New Year', type: 'special' },
  { date: '2026-02-25', name: 'EDSA People Power Revolution Anniversary', type: 'special' },
  { date: '2026-03-20', name: 'Eid’l Fitr (estimated)', type: 'regular' },
  { date: '2026-04-02', name: 'Maundy Thursday', type: 'regular' },
  { date: '2026-04-03', name: 'Good Friday', type: 'regular' },
  { date: '2026-04-04', name: 'Black Saturday', type: 'special' },
  { date: '2026-04-09', name: 'Araw ng Kagitingan', type: 'regular' },
  { date: '2026-05-01', name: 'Labor Day', type: 'regular' },
  { date: '2026-05-27', name: 'Eid’l Adha (estimated)', type: 'regular' },
  { date: '2026-06-12', name: 'Independence Day', type: 'regular' },
  { date: '2026-08-21', name: 'Ninoy Aquino Day', type: 'special' },
  { date: '2026-08-31', name: 'National Heroes Day', type: 'regular' },
  { date: '2026-11-01', name: 'All Saints’ Day', type: 'special' },
  { date: '2026-11-02', name: 'Additional special non-working day', type: 'special' },
  { date: '2026-11-30', name: 'Bonifacio Day', type: 'regular' },
  { date: '2026-12-08', name: 'Feast of the Immaculate Conception', type: 'special' },
  { date: '2026-12-24', name: 'Christmas Eve', type: 'special' },
  { date: '2026-12-25', name: 'Christmas Day', type: 'regular' },
  { date: '2026-12-30', name: 'Rizal Day', type: 'regular' },
  { date: '2026-12-31', name: 'Last Day of the Year', type: 'special' },
  { date: '2027-01-01', name: 'New Year’s Day', type: 'regular' },
  { date: '2027-02-06', name: 'Chinese New Year', type: 'special' },
  { date: '2027-02-25', name: 'EDSA People Power Revolution Anniversary', type: 'special' },
  { date: '2027-03-10', name: 'Eid’l Fitr (estimated)', type: 'regular' },
  { date: '2027-03-25', name: 'Maundy Thursday', type: 'regular' },
  { date: '2027-03-26', name: 'Good Friday', type: 'regular' },
  { date: '2027-03-27', name: 'Black Saturday', type: 'special' },
  { date: '2027-04-09', name: 'Araw ng Kagitingan', type: 'regular' },
  { date: '2027-05-01', name: 'Labor Day', type: 'regular' },
  { date: '2027-05-17', name: 'Eid’l Adha (estimated)', type: 'regular' },
  { date: '2027-06-12', name: 'Independence Day', type: 'regular' },
  { date: '2027-08-21', name: 'Ninoy Aquino Day', type: 'special' },
  { date: '2027-08-30', name: 'National Heroes Day', type: 'regular' },
  { date: '2027-11-01', name: 'All Saints’ Day', type: 'special' },
  { date: '2027-11-30', name: 'Bonifacio Day', type: 'regular' },
  { date: '2027-12-08', name: 'Feast of the Immaculate Conception', type: 'special' },
  { date: '2027-12-24', name: 'Christmas Eve', type: 'special' },
  { date: '2027-12-25', name: 'Christmas Day', type: 'regular' },
  { date: '2027-12-30', name: 'Rizal Day', type: 'regular' },
  { date: '2027-12-31', name: 'Last Day of the Year', type: 'special' },
]
