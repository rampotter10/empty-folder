export type RoomType = 'SINGLE' | 'DOUBLE' | 'SUITE'

export interface Room {
  id: number
  number: string
  type: RoomType
  pricePerNight: number
  description?: string
}

export interface Guest {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type BookingStatus = 'ACTIVE' | 'CANCELLED'

export interface Booking {
  id: number
  room: Room
  guest: Guest
  checkInDate: string
  checkOutDate: string
  status: BookingStatus
  totalPrice: number
}

export interface CreateBookingRequest {
  roomId: number
  guestId: number
  checkInDate: string
  checkOutDate: string
}