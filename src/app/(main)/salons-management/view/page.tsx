import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '../../../../components/ui/card';

export default function SalonProfile() {
  return (
    <div className="">
      <div className="">
        {/* Header Section */}
        <Card className="bg-white shadow-none rounded-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-semibold text-gray-800">Luxe Wellness</h1>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 px-3 py-1 text-sm font-normal">
                  Active
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <span>Salon</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <span>ID: SLN-88234</span>
              </div>
              <p className="text-gray-600">Created since Oct 12, 2023</p>
            </div>
            <Button className="bg-[#A8D5BA] hover:bg-[#A8D5BA] text-gray-800 px-8 py-5 text-base font-medium rounded-lg">
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Business Address Section */}
        <Card className=" p-8 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 tracking-wide mb-3">BUSINESS ADDRESS</h2>
          <p className="text-gray-700">742 Evergreen Terrace, Beverly Hills, CA 90210, United States</p>
        </Card>

        {/* Bottom Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Business Admin Information */}
          <Card className="shadow-none p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-800">Business Admin Information</h2>
              <button className="text-red-400 hover:text-red-500 hover:underline cursor-pointer text-base font-normal">
                Edit Info
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 tracking-wide mb-2">CONTACT EMAIL</h3>
                <p className="text-gray-700">contact@luxewellness.com</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 tracking-wide mb-2">PHONE NUMBER</h3>
                <p className="text-gray-700">+1 (555) 012-3456</p>
              </div>
            </div>
          </Card>

          {/* Stats Section */}
          <div className="space-y-6">
            {/* Total Active Members */}
            <Card className="shadow-none p-8">
              <h3 className="text-sm font-semibold text-gray-700 tracking-wide mb-3">TOTAL ACTIVE MEMBERS</h3>
              <p className="text-3xl font-semibold text-gray-800">1,248</p>
            </Card>

            {/* Points Issued */}
            <Card className="shadow-none p-8">
              <h3 className="text-sm font-semibold text-gray-700 tracking-wide mb-3">POINTS ISSUED</h3>
              <p className="text-3xl font-semibold text-gray-800">156.4k</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}