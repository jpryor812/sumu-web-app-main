import { Tier } from '@/app/signup/creator-setup/page';

interface TierEditorProps {
  tier: Tier;
  tierIndex: number;
  canRemove: boolean;
  newFeature: string;
  onRemoveTier: () => void;
  onTierChange: (index: number, field: keyof Tier, value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (featureIndex: number) => void;
  onNewFeatureChange: (value: string) => void;
}

export default function TierEditor({
  tier,
  tierIndex,
  canRemove,
  newFeature,
  onRemoveTier,
  onTierChange,
  onAddFeature,
  onRemoveFeature,
  onNewFeatureChange
}: TierEditorProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-medium">Tier {tierIndex + 1}</h3>
        {canRemove && (
          <button
            type="button"
            onClick={onRemoveTier}
            className="text-red-400 hover:text-red-300 px-2 py-1 rounded"
          >
            Remove Tier
          </button>
        )}
      </div>
      
      <div className="mb-3">
        <label className="block text-gray-300 text-sm mb-1">
          Name
        </label>
        <input
          type="text"
          value={tier.name}
          onChange={(e) => onTierChange(tierIndex, 'name', e.target.value)}
          placeholder="e.g., Basic Fan"
          className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-3">
        <label className="block text-gray-300 text-sm mb-1">
          Monthly Price ($)
        </label>
        <input
          type="number"
          value={tier.price}
          onChange={(e) => onTierChange(tierIndex, 'price', e.target.value)}
          min="1"
          step="1"
          className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-3">
        <label className="block text-gray-300 text-sm mb-1">
          Description
        </label>
        <input
          type="text"
          value={tier.description}
          onChange={(e) => onTierChange(tierIndex, 'description', e.target.value)}
          placeholder="What do subscribers get?"
          className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Features Section */}
      <div className="mb-3">
        <label className="block text-gray-300 text-sm mb-1">
          Features
        </label>
        
        <ul className="mb-2">
          {tier.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-center mb-2 bg-gray-700 rounded p-2">
              <span className="flex-1 text-white">{feature}</span>
              <button
                type="button"
                onClick={() => onRemoveFeature(featureIndex)}
                className="text-red-400 hover:text-red-300 text-xl font-bold"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        
        <div className="flex">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => onNewFeatureChange(e.target.value)}
            placeholder="Add a feature..."
            className="flex-1 bg-gray-700 text-white rounded-l p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={onAddFeature}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-r flex items-center"
          >
            <span className="mr-1">+</span>
            Add
          </button>
        </div>
      </div>
    </div>
  );
} 