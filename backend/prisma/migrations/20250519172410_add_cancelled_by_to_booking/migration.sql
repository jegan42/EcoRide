-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_canceller_id_fkey" FOREIGN KEY ("canceller_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
