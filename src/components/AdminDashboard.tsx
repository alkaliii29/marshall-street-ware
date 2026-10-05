import React, { useState } from 'react';
import { Product, Order, AdminTab, formatINR } from '../types';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  resetProducts,
  PRESET_IMAGES,
} from '../services/productStorage';
import { AdminSalesAnalytics } from './AdminSalesAnalytics';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  PlusCircle,
  Edit2,
  Trash2,
  ArrowLeft,
  LogOut,
  RotateCcw,
  Search,
  Check,
  X,
  ExternalLink,
  DollarSign,
  Boxes,
  AlertTriangle,
  ShoppingBag,
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onExit: () => void;
  onViewProductOnStorefront: (productId: string) => void;
  initialTab?: AdminTab;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  onExit,
  onViewProductOnStorefront,
  initialTab = 'dashboard',
}) => {
  const { logoutAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Product Add / Edit state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // New product form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: PRESET_IMAGES[0].url,
    category: 'Hoodies' as Product['category'],
    description: '',
    stock: '25',
    sku: '',
    isFeatured: false,
    isNewArrival: true,
    sizes: 'S, M, L, XL',
    details: 'Heavyweight organic cotton, Double lockstitch construction, Signature Marshall label',
  });

  // Calculate Metrics
  const totalSKUs = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalInventoryValue = products.reduce((acc, p) => acc + p.price * (p.stock || 0), 0);
  const totalRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      image: PRESET_IMAGES[0].url,
      category: 'Hoodies',
      description: '',
      stock: '25',
      sku: '',
      isFeatured: false,
      isNewArrival: true,
      sizes: 'S, M, L, XL',
      details: 'Heavyweight organic cotton, Double lockstitch construction, Signature Marshall label',
    });
  };

  // Add Product Handler
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.image.trim()) {
      showToast('Name, price and image URL are required', 'error');
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('Please enter a valid price in ₹', 'error');
      return;
    }

    const stockNum = parseInt(formData.stock, 10) || 0;
    const sizesArray = formData.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const detailsArray = formData.details
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const created = addProduct({
      name: formData.name.trim(),
      price: priceNum,
      image: formData.image.trim(),
      category: formData.category,
      description: formData.description.trim() || 'Custom engineered heavyweight streetwear.',
      details: detailsArray.length > 0 ? detailsArray : ['Premium custom textile', 'Architectural cut'],
      sizes: sizesArray.length > 0 ? sizesArray : ['S', 'M', 'L', 'XL'],
      isNewArrival: formData.isNewArrival,
      isFeatured: formData.isFeatured,
      stock: stockNum,
      sku: formData.sku.trim() || undefined,
    });

    showToast('Product added to catalog', 'success', `${created.name} is now live.`);
    resetForm();
    setIsAddProductModalOpen(false);
    setActiveTab('products');
  };

  // Edit Product Submit
  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const priceNum = typeof editingProduct.price === 'string' ? parseFloat(editingProduct.price) : editingProduct.price;
    const stockNum = typeof editingProduct.stock === 'string' ? parseInt(editingProduct.stock, 10) : editingProduct.stock;

    const updated = updateProduct(editingProduct.id, {
      ...editingProduct,
      price: priceNum || 0,
      stock: stockNum || 0,
    });

    if (updated) {
      showToast('Product updated successfully', 'success', `${updated.name} has been refreshed.`);
      setEditingProduct(null);
    }
  };

  // Delete Product
  const confirmDelete = () => {
    if (!productToDelete) return;
    const name = productToDelete.name;
    const success = deleteProduct(productToDelete.id);
    if (success) {
      showToast('Product deleted', 'info', `${name} removed from catalog.`);
    }
    setProductToDelete(null);
  };

  const handleResetCatalog = () => {
    if (window.confirm('Reset catalog products to default Marshall archive?')) {
      resetProducts();
      showToast('Default catalog restored', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col md:flex-row">
      
      {/* NAVIGATION SIDEBAR */}
      <aside className="w-full md:w-64 bg-zinc-950 border-r border-zinc-900 shrink-0 flex flex-col justify-between">
        <div>
          {/* Studio Brand */}
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
            <div>
              <span className="font-display text-lg font-extrabold tracking-tight text-white block">
                MARSHALL
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
                ADMIN &bull; ANALYTICS PANEL
              </span>
            </div>
          </div>

          {/* Navigation Links: Dashboard, Products, Sales Analytics */}
          <nav className="p-3 space-y-1.5">
            
            {/* 1. Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-colors text-left ${
                activeTab === 'dashboard'
                  ? 'bg-amber-400 text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {/* 2. Products */}
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-colors text-left ${
                activeTab === 'products'
                  ? 'bg-amber-400 text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </button>

            {/* 3. Sales Analytics */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-colors text-left ${
                activeTab === 'analytics'
                  ? 'bg-amber-400 text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Sales Analytics</span>
            </button>

          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-zinc-900 space-y-2">
          <button
            onClick={onExit}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-900 border border-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront View</span>
          </button>

          <button
            onClick={handleResetCatalog}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 rounded-lg transition-colors"
            title="Reset catalog demo items"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Products</span>
          </button>

          <button
            onClick={() => {
              logoutAdmin();
              onExit();
              showToast('Logged out of Admin Studio', 'info');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 bg-black overflow-y-auto">
        
        {/* Top Header Bar */}
        <div className="border-b border-zinc-900 bg-zinc-950/80 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
              {activeTab === 'dashboard' && 'Marshall Executive Overview'}
              {activeTab === 'products' && 'Product Catalog Management'}
              {activeTab === 'analytics' && 'Sales Analytics & Revenue'}
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Live LocalStorage synchronization &bull; Real-time updates active
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'products' && (
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-display font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-105 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Add Product</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl">
            
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-xl">
                <div className="flex justify-between items-center text-zinc-400 mb-2">
                  <span className="text-xs font-mono uppercase">Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-display font-extrabold text-amber-400">
                  {formatINR(totalRevenue)}
                </div>
                <span className="text-[11px] font-mono text-zinc-500 mt-1 block">From {orders.length} direct orders</span>
              </div>

              <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-xl">
                <div className="flex justify-between items-center text-zinc-400 mb-2">
                  <span className="text-xs font-mono uppercase">Catalog SKUs</span>
                  <Boxes className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="text-3xl font-display font-extrabold text-white">
                  {totalSKUs}
                </div>
                <span className="text-[11px] font-mono text-zinc-500 mt-1 block">Active pieces in store</span>
              </div>

              <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-xl">
                <div className="flex justify-between items-center text-zinc-400 mb-2">
                  <span className="text-xs font-mono uppercase">Inventory Valuation</span>
                  <Package className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="text-3xl font-display font-extrabold text-white">
                  {formatINR(totalInventoryValue)}
                </div>
                <span className="text-[11px] font-mono text-zinc-500 mt-1 block">{totalStockUnits} stock units</span>
              </div>

              <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-xl">
                <div className="flex justify-between items-center text-zinc-400 mb-2">
                  <span className="text-xs font-mono uppercase">Low Stock Alerts</span>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-3xl font-display font-extrabold text-rose-400">
                  {lowStockCount}
                </div>
                <span className="text-[11px] font-mono text-zinc-500 mt-1 block">&le; 5 units remaining</span>
              </div>

            </div>

            {/* Quick Action Banner */}
            <div className="p-6 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                  FAST-ACTION SHORTCUTS
                </span>
                <h3 className="font-display text-xl font-bold uppercase text-white mt-1">
                  Manage Store Inventory & Track Sales
                </h3>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">
                  Launch a new drop, review incoming orders, or examine October monthly sales curves.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-display font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-105 transition-all shadow-md"
                >
                  + Add New Product
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  View Analytics &rarr;
                </button>
              </div>
            </div>

            {/* Recent Orders Snapshot in Dashboard */}
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-900">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <h3 className="font-display text-base font-bold uppercase text-white">
                    Latest Direct Orders
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="text-xs font-mono text-amber-400 hover:underline"
                >
                  Open Full Analytics &rarr;
                </button>
              </div>

              <div className="space-y-2">
                {orders.slice(0, 4).map((order) => (
                  <div
                    key={order.id}
                    className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                  >
                    <div>
                      <span className="text-amber-400 font-bold mr-2">{order.id}</span>
                      <span className="text-white font-sans font-medium">{order.productName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400">
                      <span>{order.customerName}</span>
                      <span className="text-white font-bold font-display">{formatINR(order.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Search, Filter & View Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search by name, SKU or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Dropdown & Table/Grid Mode */}
              <div className="flex items-center gap-3 flex-wrap">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-300 px-3 py-2 focus:outline-none focus:border-amber-400 uppercase"
                >
                  <option value="All">All Categories</option>
                  <option value="Hoodies">Hoodies</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Pants">Pants</option>
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                </select>

                <div className="flex border border-zinc-800 bg-zinc-950 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-2 text-xs font-mono uppercase ${
                      viewMode === 'table' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 text-xs font-mono uppercase ${
                      viewMode === 'grid' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Grid
                  </button>
                </div>
              </div>

            </div>

            {/* Products Table or Grid */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center border border-zinc-900 bg-zinc-950 rounded-xl">
                <p className="font-display text-lg uppercase text-zinc-400">No matching products found</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('All');
                  }}
                  className="mt-4 px-4 py-2 border border-zinc-800 rounded-lg text-xs font-mono uppercase text-zinc-300 hover:text-white"
                >
                  Clear Filter
                </button>
              </div>
            ) : viewMode === 'table' ? (
              /* Table View */
              <div className="border border-zinc-900 bg-zinc-950 rounded-xl overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/60 text-[11px] font-mono uppercase text-zinc-400 tracking-wider">
                      <th className="py-3.5 px-4">Item</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price (₹)</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Tags</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs font-mono">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-14 bg-zinc-900 rounded shrink-0 overflow-hidden border border-zinc-800">
                              <img
                                src={p.image}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-white font-sans text-sm line-clamp-1">
                                {p.name}
                              </div>
                              <span className="text-[11px] text-zinc-500 font-mono">SKU: {p.sku}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-zinc-300">
                          {p.category}
                        </td>

                        <td className="py-3 px-4 font-display font-bold text-white text-sm">
                          {formatINR(p.price)}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                p.stock > 10 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                            />
                            <span className="tabular-nums text-zinc-300">{p.stock} units</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 text-[10px]">
                            {p.isNewArrival && (
                              <span className="px-1.5 py-0.5 bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded">
                                NEW
                              </span>
                            )}
                            {p.isFeatured && (
                              <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded">
                                FEATURED
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onViewProductOnStorefront(p.id)}
                              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"
                              title="View on storefront"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setProductToDelete(p)}
                              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/5] bg-zinc-900 rounded-lg overflow-hidden mb-3 border border-zinc-900 relative">
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex gap-1 text-[10px] font-mono">
                          {p.isNewArrival && (
                            <span className="bg-amber-400 text-black font-bold px-1.5 py-0.5 rounded">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between text-[11px] font-mono text-zinc-500 mb-1">
                        <span>{p.category}</span>
                        <span>{p.sku}</span>
                      </div>
                      <h4 className="font-semibold text-white text-sm line-clamp-1 font-sans">{p.name}</h4>
                      <div className="flex justify-between items-baseline mt-2 text-xs font-mono">
                        <span className="font-display font-bold text-white text-base">
                          {formatINR(p.price)}
                        </span>
                        <span className="text-zinc-400">{p.stock} units</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-900 mt-3 text-xs font-mono">
                      <button
                        onClick={() => onViewProductOnStorefront(p.id)}
                        className="text-zinc-400 hover:text-white flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="text-zinc-400 hover:text-amber-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setProductToDelete(p)}
                          className="text-zinc-400 hover:text-rose-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: SALES ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <AdminSalesAnalytics orders={orders} />
          </div>
        )}

      </main>

      {/* ADD NEW PRODUCT MODAL */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setIsAddProductModalOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto z-10 shadow-2xl animate-in fade-in my-8">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-900 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                  CATALOG INVENTORY
                </span>
                <h3 className="font-display text-xl font-bold uppercase text-white">
                  Add New Streetwear Product
                </h3>
              </div>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">Product Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Marshall Acid Mineral Oversized Tee"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono uppercase"
                  >
                    <option value="Hoodies">Hoodies</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Pants">Pants</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">Price (₹ INR) *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="1999"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">Inventory Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">SKU (Optional)</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Image URL & Presets */}
              <div className="space-y-2 pt-2 border-t border-zinc-900">
                <label className="text-xs font-mono uppercase text-zinc-400 block">Image URL *</label>
                <input
                  required
                  type="text"
                  placeholder="https://... or /src/assets/images/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                />

                <span className="text-[11px] font-mono text-zinc-500 block">Or select a high-res preset:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset.url })}
                      className={`p-1.5 border rounded-lg text-left flex items-center gap-2 text-xs font-mono transition-colors ${
                        formData.image === preset.url
                          ? 'bg-zinc-800 border-amber-400 text-white'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-7 h-7 rounded object-cover shrink-0"
                      />
                      <span className="truncate text-[10px]">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-zinc-400">Description</label>
                <textarea
                  rows={2}
                  placeholder="Oversized fit, heavyweight fabric, styling details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2 p-2.5 bg-zinc-900/60 border border-zinc-800 rounded-lg text-xs font-mono cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="accent-amber-400 w-4 h-4 rounded"
                  />
                  <span>New Arrival Flag</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 bg-zinc-900/60 border border-zinc-800 rounded-lg text-xs font-mono cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-amber-400 w-4 h-4 rounded"
                  />
                  <span>Featured Piece Flag</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 border border-zinc-800 rounded-lg text-xs font-mono uppercase text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-display font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-105 transition-all shadow-md"
                >
                  Publish Piece
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setEditingProduct(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto z-10 shadow-2xl animate-in fade-in my-8">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-900 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                  SKU: {editingProduct.sku}
                </span>
                <h3 className="font-display text-xl font-bold uppercase text-white">
                  Edit Product Details
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-zinc-400">Product Title</label>
                <input
                  required
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">Price (₹ INR)</label>
                  <input
                    required
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">Stock Units</label>
                  <input
                    required
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-zinc-400">Image URL</label>
                <input
                  required
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-zinc-400">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase"
                >
                  <option value="Hoodies">Hoodies</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Pants">Pants</option>
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-zinc-400">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2 p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNewArrival}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                    className="accent-amber-400"
                  />
                  <span>New Arrival Flag</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="accent-amber-400"
                  />
                  <span>Featured Piece Flag</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-zinc-800 rounded-lg text-xs font-mono uppercase text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-display font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-105 transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setProductToDelete(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl p-6 z-10 shadow-2xl animate-in fade-in space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6 stroke-[1.5]" />
              <h3 className="font-display text-lg font-bold uppercase text-white">
                Delete Product?
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              Are you sure you want to remove <span className="text-white font-semibold">{productToDelete.name}</span> from the Marshall store? This will delete the SKU from localStorage.
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 border border-zinc-800 rounded-lg text-xs font-mono uppercase text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 text-white font-semibold text-xs font-mono uppercase rounded-lg hover:bg-rose-500 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
