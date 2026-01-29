import { useState, useEffect } from 'react';
import useAuth from "../../hooks/useAuth";
import axios from 'axios';

const WithdrawalRequest = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);
    const [withdrawals, setWithdrawals] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('bank');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get user balance
                const balanceRes = await axios.get(`${import.meta.env.VITE_API_URL}/users/balance/${user?.email}`);
                setBalance(balanceRes.data.balance);

                // Get user withdrawals
                const withdrawalsRes = await axios.get(`${import.meta.env.VITE_API_URL}/withdrawals/user/${user?.email}`);
                setWithdrawals(withdrawalsRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        if (user?.email) {
            fetchData();
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const numAmount = parseFloat(amount);
            if (isNaN(numAmount)) {
                setError('Please enter a valid amount');
                return;
            }

            if (numAmount <= 0) {
                setError('Amount must be greater than 0');
                return;
            }

            if (numAmount > balance) {
                setError('Insufficient balance');
                return;
            }

            await axios.post(`${import.meta.env.VITE_API_URL}/withdrawals`, {
                email: user.email,
                amount: numAmount,
                paymentMethod
            });

            setSuccess('Withdrawal request submitted successfully');
            setShowModal(false);
            setAmount('');

            // Refresh data
            const balanceRes = await axios.get(`${import.meta.env.VITE_API_URL}/users/balance/${user?.email}`);
            setBalance(balanceRes.data.balance);

            const withdrawalsRes = await axios.get(`${import.meta.env.VITE_API_URL}/withdrawals/user/${user?.email}`);
            setWithdrawals(withdrawalsRes.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit withdrawal request');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="container mx-auto px-4 mt-8">
            <h2 className="text-2xl font-bold mb-4">Withdrawal Request</h2>

            <div className="bg-white rounded-lg shadow-md mb-6">
                <div className="p-6">
                    <h5 className="text-xl font-semibold mb-2">Your Balance</h5>
                    <p className="text-4xl font-bold mb-4">${balance.toFixed(2)}</p>
                    <button
                        className={`px-4 py-2 rounded font-medium ${balance <= 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        onClick={() => setShowModal(true)}
                        disabled={balance <= 0}
                    >
                        Request Withdrawal
                    </button>
                </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Your Withdrawal History</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {withdrawals.length > 0 ? (
                            withdrawals.map((withdrawal) => (
                                <tr key={withdrawal._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(withdrawal.createdAt)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">${withdrawal.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap capitalize">{withdrawal.paymentMethod}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${withdrawal.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                withdrawal.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {withdrawal.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No withdrawal requests found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full mx-4">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">Request Withdrawal</h3>
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
                            {error && (
                                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                    {success}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                                        Amount
                                    </label>
                                    <input
                                        id="amount"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter amount to withdraw"
                                        step="0.01"
                                        min="0.01"
                                        max={balance}
                                        required
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    <p className="text-gray-500 text-xs mt-1">
                                        Available balance: ${balance.toFixed(2)}
                                    </p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paymentMethod">
                                        Payment Method
                                    </label>
                                    <select
                                        id="paymentMethod"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="bank">Bank Transfer</option>
                                        <option value="paypal">PayPal</option>
                                        <option value="venmo">Venmo</option>
                                    </select>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WithdrawalRequest;