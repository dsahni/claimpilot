import { mockRepairShops } from '@/data/mockRepairShops';
import Card from '@/components/ui/Card';

export default function RepairShops() {
  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Recommended Repair Shops</h3>
      <div className="space-y-3">
        {mockRepairShops.map((shop, i) => (
          <div
            key={i}
            className="flex items-start justify-between p-4 rounded-lg border border-slate-200 bg-slate-50"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900">{shop.name}</p>
                {shop.preApproved && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Pre-approved
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">{shop.address}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <div className="flex items-center gap-1 text-sm">
                <span className="text-amber-500">&#9733;</span>
                <span className="font-medium text-slate-800">{shop.rating}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{shop.distance}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
