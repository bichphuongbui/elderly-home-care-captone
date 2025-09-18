import React, { useMemo, useState } from 'react';

const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const WithdrawPage: React.FC = () => {
  // Mocked finance data
  const [availableBalance] = useState<number>(2400000);
  const [withdrawnThisMonth] = useState<number>(500000);
  const [lastWithdrawDate] = useState<string>('2025-09-10');

  // Form state
  const [amount, setAmount] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountHolder, setAccountHolder] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Validation
  const minAmount = 100000;
  const parsedAmount = useMemo(() => Number(amount || 0), [amount]);
  const errors = useMemo(() => {
    const next: Record<string, string> = {};
    if (!amount || isNaN(parsedAmount)) next.amount = 'Vui lòng nhập số tiền hợp lệ';
    else if (parsedAmount < minAmount) next.amount = `Số tiền tối thiểu là ${formatCurrency(minAmount)}`;
    else if (parsedAmount > availableBalance) next.amount = 'Số tiền vượt quá số dư khả dụng';
    if (!bankName.trim()) next.bankName = 'Vui lòng nhập tên ngân hàng';
    if (!accountNumber.trim()) next.accountNumber = 'Vui lòng nhập số tài khoản';
    if (!accountHolder.trim()) next.accountHolder = 'Vui lòng nhập chủ tài khoản';
    if (!confirmed) next.confirmed = 'Bạn cần xác nhận thông tin trước khi gửi';
    return next;
  }, [amount, parsedAmount, bankName, accountNumber, accountHolder, confirmed, availableBalance]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    const payload = {
      amount: parsedAmount,
      bankName,
      accountNumber,
      accountHolder,
      note,
      requestedAt: new Date().toISOString(),
    };
    console.log('Withdraw request payload:', payload);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">Yêu cầu rút tiền đã được gửi</h1>
            <p className="mt-3 text-gray-700 leading-7">
              Bộ phận tài chính sẽ xử lý trong vòng 1–2 ngày làm việc. Bạn vui lòng theo dõi thông báo hoặc lịch sử giao dịch.
            </p>
            <div className="mt-6 text-sm text-gray-600">
              Số tiền yêu cầu: <span className="font-semibold text-gray-900">{formatCurrency(parsedAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Yêu cầu rút tiền</h1>

        {/* Finance summary */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-600">Số dư khả dụng</div>
            <div className="mt-1 text-2xl font-bold text-emerald-700">{formatCurrency(availableBalance)}</div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-600">Đã rút trong tháng</div>
            <div className="mt-1 text-xl font-semibold text-gray-900">{formatCurrency(withdrawnThisMonth)}</div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-600">Lần rút gần nhất</div>
            <div className="mt-1 text-xl font-semibold text-gray-900">{lastWithdrawDate || '—'}</div>
          </div>
        </div>

        {/* Withdraw form */}
        <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-900">Số tiền muốn rút (VNĐ)</label>
            <input
              type="number"
              min={0}
              step={10000}
              inputMode="numeric"
              className={`mt-2 w-full rounded-lg border px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.amount ? 'border-red-300' : 'border-gray-200'}`}
              placeholder="Nhập số tiền (tối thiểu 100,000đ)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-900">Ngân hàng</label>
              <input
                className={`mt-2 w-full rounded-lg border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.bankName ? 'border-red-300' : 'border-gray-200'}`}
                placeholder="VD: Vietcombank, ACB, Techcombank..."
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
              {errors.bankName && <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900">Số tài khoản ngân hàng</label>
              <input
                className={`mt-2 w-full rounded-lg border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.accountNumber ? 'border-red-300' : 'border-gray-200'}`}
                placeholder="Nhập số tài khoản"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                inputMode="numeric"
              />
              {errors.accountNumber && <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900">Chủ tài khoản</label>
            <input
              className={`mt-2 w-full rounded-lg border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.accountHolder ? 'border-red-300' : 'border-gray-200'}`}
              placeholder="Nhập tên chủ tài khoản"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
            />
            {errors.accountHolder && <p className="mt-1 text-sm text-red-600">{errors.accountHolder}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900">Ghi chú (tuỳ chọn)</label>
            <textarea
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Ghi chú cho bộ phận tài chính (nếu có)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <label className="mt-2 inline-flex items-start gap-3 text-sm text-gray-700">
            <input type="checkbox" className="mt-1" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
            <span>Tôi xác nhận các thông tin là chính xác</span>
          </label>
          {errors.confirmed && <p className="-mt-1 text-sm text-red-600">{errors.confirmed}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full sm:w-auto rounded-lg px-5 py-3 text-base font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              Gửi yêu cầu rút tiền
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawPage;


