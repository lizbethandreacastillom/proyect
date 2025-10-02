import { useState, useEffect } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Product = {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
};

type OptionGroup = {
  id: string;
  name: string;
  is_required: boolean;
  allow_multiple: boolean;
  display_order: number;
  options: Option[];
};

type Option = {
  id: string;
  name: string;
  additional_price: number;
  display_order: number;
};

type ProductModalProps = {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedOptions: string[], totalPrice: number) => void;
};

export default function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOptions();
  }, [product.id]);

  const loadOptions = async () => {
    try {
      const { data: productGroups } = await supabase
        .from('product_option_groups')
        .select('option_group_id')
        .eq('product_id', product.id);

      if (!productGroups || productGroups.length === 0) {
        setLoading(false);
        return;
      }

      const groupIds = productGroups.map((pg) => pg.option_group_id);

      const { data: groups } = await supabase
        .from('option_groups')
        .select('*')
        .in('id', groupIds)
        .order('display_order');

      if (groups) {
        const groupsWithOptions = await Promise.all(
          groups.map(async (group) => {
            const { data: options } = await supabase
              .from('options')
              .select('*')
              .eq('group_id', group.id)
              .order('display_order');

            return {
              ...group,
              options: options || [],
            };
          })
        );

        setOptionGroups(groupsWithOptions);
      }
    } catch (error) {
      console.error('Error loading options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionToggle = (optionId: string, groupId: string, allowMultiple: boolean) => {
    const newSelected = new Set(selectedOptions);

    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      if (!allowMultiple) {
        const group = optionGroups.find((g) => g.id === groupId);
        group?.options.forEach((opt) => newSelected.delete(opt.id));
      }
      newSelected.add(optionId);
    }

    setSelectedOptions(newSelected);
  };

  const calculateTotalPrice = () => {
    let total = product.base_price;

    optionGroups.forEach((group) => {
      group.options.forEach((option) => {
        if (selectedOptions.has(option.id)) {
          total += option.additional_price;
        }
      });
    });

    return total * quantity;
  };

  const canAddToCart = () => {
    return optionGroups.every((group) => {
      if (!group.is_required) return true;
      return group.options.some((opt) => selectedOptions.has(opt.id));
    });
  };

  const handleAddToCart = () => {
    if (canAddToCart()) {
      onAddToCart(product, quantity, Array.from(selectedOptions), calculateTotalPrice());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}

          {product.description && (
            <p className="text-gray-600 mb-6">{product.description}</p>
          )}

          <div className="mb-6">
            <span className="text-3xl font-bold text-orange-600">
              ${product.base_price.toFixed(2)}
            </span>
            <span className="text-gray-500 ml-2">precio base</span>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            </div>
          ) : (
            <>
              {optionGroups.map((group) => (
                <div key={group.id} className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {group.name}
                    {group.is_required && <span className="text-red-500 ml-1">*</span>}
                    <span className="text-sm text-gray-500 ml-2">
                      {group.allow_multiple ? '(puedes elegir varios)' : '(elige uno)'}
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {group.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <input
                            type={group.allow_multiple ? 'checkbox' : 'radio'}
                            name={group.id}
                            checked={selectedOptions.has(option.id)}
                            onChange={() => handleOptionToggle(option.id, group.id, group.allow_multiple)}
                            className="mr-3"
                          />
                          <span className="text-gray-700">{option.name}</span>
                        </div>
                        {option.additional_price > 0 && (
                          <span className="text-orange-600 font-semibold">
                            +${option.additional_price.toFixed(2)}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Cantidad</span>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart() || loading}
            className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar al carrito - ${calculateTotalPrice().toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
