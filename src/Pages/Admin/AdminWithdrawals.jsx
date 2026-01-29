import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminWithdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchWithdrawals = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/withdrawals`);
                setWithdrawals(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching withdrawals:", err);
                setLoading(false);
            }
        };
        fetchWithdrawals();
    }, []);

    const handleStatusUpdate = async (status) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/withdrawals/${selectedWithdrawal._id}`, { status });

            // Update local state
            setWithdrawals(withdrawals.map(w =>
                w._id === selectedWithdrawal._id ? { ...w, status } : w
            ));

            setShowModal(false);
        } catch (err) {
            console.error("Error updating withdrawal status:", err);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Withdrawal Requests Management</h2>

            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {withdrawals.map((withdrawal) => (
                                <tr key={withdrawal._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(withdrawal.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {withdrawal.name} ({withdrawal.email})
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${withdrawal.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                        {withdrawal.paymentMethod}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${withdrawal.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                withdrawal.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {withdrawal.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {withdrawal.status === 'pending' && (
                                            <button
                                                className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-100 focus:outline-none"
                                                onClick={() => {
                                                    setSelectedWithdrawal(withdrawal);
                                                    setShowModal(true);
                                                }}
                                            >
                                                Manage
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full mx-4">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-xl font-semibold">Manage Withdrawal Request</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="space-y-3 mb-6">
                                <p><span className="font-semibold">User:</span> {selectedWithdrawal?.name} ({selectedWithdrawal?.email})</p>
                                <p><span className="font-semibold">Amount:</span> ${selectedWithdrawal?.amount?.toFixed(2)}</p>
                                <p><span className="font-semibold">Payment Method:</span> {selectedWithdrawal?.paymentMethod}</p>
                                <p><span className="font-semibold">Request Date:</span> {selectedWithdrawal && formatDate(selectedWithdrawal.createdAt)}</p>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none"
                                    onClick={() => handleStatusUpdate('approved')}
                                >
                                    Approve
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
                                    onClick={() => handleStatusUpdate('rejected')}
                                >
                                    Reject
                                </button>
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminWithdrawals;