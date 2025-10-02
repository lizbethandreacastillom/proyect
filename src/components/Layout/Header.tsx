import { useAuth } from '../../contexts/AuthContext';
import { Utensils, LogOut, User, ShoppingCart, Settings } from 'lucide-react';

export default function Header() {
  const { profile, signOut } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-600 p-2 rounded-lg">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Los Antojitos de Misha</h1>
              <p className="text-xs text-gray-500">Antojitos mexicanos</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-orange-600 transition">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            {profile?.role === 'admin' && (
              <button className="p-2 text-gray-600 hover:text-orange-600 transition">
                <Settings className="w-6 h-6" />
              </button>
            )}

            <div className="flex items-center space-x-2 text-gray-700">
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">{profile?.full_name}</span>
              {profile?.role === 'admin' && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                  Admin
                </span>
              )}
            </div>

            <button
              onClick={() => signOut()}
              className="p-2 text-gray-600 hover:text-red-600 transition"
              title="Cerrar sesión"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
