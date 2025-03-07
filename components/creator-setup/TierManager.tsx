import { useState, useEffect } from 'react';
import { Tier } from '@/app/signup/creator-setup/page';
import TierEditor from '@/components/creator-setup/TierEditor';

interface TierManagerProps {
  tiers: Tier[];
  setTiers: React.Dispatch<React.SetStateAction<Tier[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function TierManager({ tiers, setTiers, setError }: TierManagerProps) {
  // Initialize newFeatures with empty strings for each tier
  const [newFeatures, setNewFeatures] = useState<string[]>(() => 
    Array(tiers.length).fill('')
  );
  
  // Update newFeatures when tiers length changes
  useEffect(() => {
    // This ensures newFeatures array is always the same length as tiers
    if (newFeatures.length !== tiers.length) {
      setNewFeatures(prev => {
        // Keep existing values and add empty strings for new tiers
        const updated = [...prev];
        while (updated.length < tiers.length) {
          updated.push('');
        }
        return updated.slice(0, tiers.length);
      });
    }
  }, [tiers.length, newFeatures.length]);
  
  // Add a new tier (up to maximum of 5)
  const addTier = () => {
    if (tiers.length >= 5) {
      setError("Maximum of 5 tiers allowed");
      return;
    }
    
    setTiers(prev => [
      ...prev,
      {
        name: `Tier ${prev.length + 1}`,
        price: '25',
        description: 'Premium membership benefits',
        features: ['All lower tier benefits']
      }
    ]);
    
    // Immediately update newFeatures to match the new tiers length
    setNewFeatures(prev => [...prev, '']);
  };

  // Remove a tier
  const removeTier = (index: number) => {
    if (tiers.length <= 1) {
      setError("You must have at least one tier");
      return;
    }
    
    setTiers(prev => prev.filter((_, i) => i !== index));
    
    // Update newFeatures when removing a tier
    setNewFeatures(prev => prev.filter((_, i) => i !== index));
  };

  // Handle tier field changes
  const handleTierChange = (index: number, field: keyof Tier, value: string) => {
    const updatedTiers = [...tiers];
    updatedTiers[index] = {
      ...updatedTiers[index],
      [field]: value
    };
    setTiers(updatedTiers);
  };

  // Add a feature to a tier
  const addFeature = (tierIndex: number) => {
    const feature = newFeatures[tierIndex] || '';
    if (feature.trim() === '') return;
    
    const updatedTiers = [...tiers];
    updatedTiers[tierIndex].features.push(feature);
    setTiers(updatedTiers);
    
    // Clear the input
    const updatedNewFeatures = [...newFeatures];
    updatedNewFeatures[tierIndex] = '';
    setNewFeatures(updatedNewFeatures);
  };

  // Remove a feature from a tier
  const removeFeature = (tierIndex: number, featureIndex: number) => {
    const updatedTiers = [...tiers];
    updatedTiers[tierIndex].features = updatedTiers[tierIndex].features.filter((_, i) => i !== featureIndex);
    setTiers(updatedTiers);
  };

  // Handle new feature input change
  const handleNewFeatureChange = (tierIndex: number, value: string) => {
    const updatedNewFeatures = [...newFeatures];
    updatedNewFeatures[tierIndex] = value;
    setNewFeatures(updatedNewFeatures);
  };

  return (
    <div className="mb-8">
      <h2 className="text-white text-xl font-medium mb-4">Membership Tiers</h2>
      
      {tiers.map((tier, tierIndex) => (
        <TierEditor
          key={tierIndex}
          tier={tier}
          tierIndex={tierIndex}
          canRemove={tiers.length > 1}
          newFeature={newFeatures[tierIndex] || ''} // Ensure it's never undefined
          onRemoveTier={() => removeTier(tierIndex)}
          onTierChange={handleTierChange}
          onAddFeature={() => addFeature(tierIndex)}
          onRemoveFeature={(featureIndex) => removeFeature(tierIndex, featureIndex)}
          onNewFeatureChange={(value) => handleNewFeatureChange(tierIndex, value)}
        />
      ))}

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={addTier}
          disabled={tiers.length >= 5}
          className={`px-6 py-2 rounded-lg flex items-center ${
            tiers.length >= 5 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <span className="mr-2">+</span> Add Membership Tier
        </button>
      </div>
    </div>
  );
} 