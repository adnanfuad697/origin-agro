'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Wallet, Users, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react'

interface KycFormProps {
  planKey: string
}

export default function KycForm({ planKey }: KycFormProps) {
  const [step, setStep] = useState(1)

  // Personal
  const [fullName, setFullName] = useState('')
  const [fatherOrSpouseName, setFatherOrSpouseName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [nidNumber, setNidNumber] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [email, setEmail] = useState('')
  const [presentAddress, setPresentAddress] = useState('')
  const [permanentAddress, setPermanentAddress] = useState('')

  // Financial
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'mfs'>('bank')
  const [bankName, setBankName] = useState('')
  const [bankBranch, setBankBranch] = useState('')
  const [accountHolderName, setAccountHolderName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')
  const [mfsProvider, setMfsProvider] = useState('bKash')
  const [mfsNumber, setMfsNumber] = useState('')

  // Nominee
  const [nomineeName, setNomineeName] = useState('')
  const [nomineeRelation, setNomineeRelation] = useState('')
  const [nomineeNid, setNomineeNid] = useState('')
  const [nomineeMobile, setNomineeMobile] = useState('')

  // Declarations
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [agreedNotFixed, setAgreedNotFixed] = useState(false)
  const [agreedLossRisk, setAgreedLossRisk] = useState(false)
  const [agreedSignature, setAgreedSignature] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  function validateStep1() {
    if (!fullName || !fatherOrSpouseName || !dateOfBirth || !nidNumber || !mobileNumber || !presentAddress) {
      setErrorMsg('Please fill in all required fields before continuing.')
      return false
    }
    setErrorMsg('')
    return true
  }

  function validateStep2() {
    if (!investmentAmount) {
      setErrorMsg('Please enter your investment amount.')
      return false
    }
    if (paymentMethod === 'bank' && (!bankName || !accountHolderName || !accountNumber)) {
      setErrorMsg('Please fill in your bank details.')
      return false
    }
    if (paymentMethod === 'mfs' && !mfsNumber) {
      setErrorMsg('Please fill in your mobile banking number.')
      return false
    }
    setErrorMsg('')
    return true
  }

  function goNext() {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep(step + 1)
  }

  function goBack() {
    setErrorMsg('')
    setStep(step - 1)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (!agreedTerms || !agreedNotFixed || !agreedLossRisk || !agreedSignature) {
      setErrorMsg('Please agree to all four declarations before submitting.')
      return
    }
    if (!nomineeName || !nomineeRelation || !nomineeMobile) {
      setErrorMsg('Please fill in nominee details before submitting.')
      return
    }

    setSubmitting(true)

    const { error } = await supabase.from('investment_applications').insert([{
      method: 'online',
      plan_key: planKey,
      full_name: fullName,
      father_or_spouse_name: fatherOrSpouseName,
      date_of_birth: dateOfBirth,
      nid_number: nidNumber,
      mobile_number: mobileNumber,
      email: email || null,
      present_address: presentAddress,
      permanent_address: permanentAddress || presentAddress,
      investment_amount: Number(investmentAmount),
      bank_name: paymentMethod === 'bank' ? bankName : null,
      bank_branch: paymentMethod === 'bank' ? bankBranch : null,
      account_holder_name: paymentMethod === 'bank' ? accountHolderName : null,
      account_number: paymentMethod === 'bank' ? accountNumber : null,
      routing_number: paymentMethod === 'bank' ? routingNumber : null,
      mfs_provider: paymentMethod === 'mfs' ? mfsProvider : null,
      mfs_number: paymentMethod === 'mfs' ? mfsNumber : null,
      nominee_name: nomineeName,
      nominee_relation: nomineeRelation,
      nominee_nid_or_birth_reg: nomineeNid,
      nominee_mobile: nomineeMobile,
      agreed_mudarabah_terms: agreedTerms,
      agreed_not_fixed_deposit: agreedNotFixed,
      agreed_capital_loss_risk: agreedLossRisk,
      agreed_digital_signature: agreedSignature,
      status: 'pending',
    }])

    setSubmitting(false)

    if (error) {
      console.error('Error submitting application:', error)
      setErrorMsg('Something went wrong submitting your application. Please try again or contact us directly.')
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-6 bg-[#F7F4EE] border border-[#0A5C36]/20 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-[#0A5C36] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-white" />
        </div>
        <h4 className="font-extrabold text-gray-900 text-lg mb-1">Application Received</h4>
        <p className="text-gray-600 text-sm">
          Thank you, {fullName}. Our team will review your application and contact you at {mobileNumber} within 24-48 hours to complete your Musharakah agreement.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-[#0A5C36] text-white' : 'bg-gray-100 text-gray-400'}`}>
              {s}
            </div>
            {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-[#0A5C36]' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* STEP 1: Personal Info */}
      {step === 1 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#0A5C36] rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900">Personal Information</h4>
              <p className="text-gray-500 text-xs">ব্যক্তিগত তথ্য</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name (as per NID) *</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Father's / Spouse's Name *</label>
              <input type="text" value={fatherOrSpouseName} onChange={(e) => setFatherOrSpouseName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Date of Birth *</label>
                <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">NID Number *</label>
                <input type="text" value={nidNumber} onChange={(e) => setNidNumber(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Mobile Number *</label>
                <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="01XXXXXXXXX" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Email (Optional)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Present Address *</label>
              <input type="text" value={presentAddress} onChange={(e) => setPresentAddress(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Permanent Address (Optional, if different)</label>
              <input type="text" value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Financial Info */}
      {step === 2 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#F26522] rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900">Financial Information</h4>
              <p className="text-gray-500 text-xs">আর্থিক তথ্য</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Investment Amount (৳) *</label>
              <input type="number" value={investmentAmount} onChange={(e) => setInvestmentAmount(e.target.value)} placeholder="e.g. 100000" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Payout Method *</label>
              <div className="flex gap-2 mb-4">
                <button type="button" onClick={() => setPaymentMethod('bank')} className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${paymentMethod === 'bank' ? 'bg-[#0A5C36] text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                  Bank Account
                </button>
                <button type="button" onClick={() => setPaymentMethod('mfs')} className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${paymentMethod === 'mfs' ? 'bg-[#0A5C36] text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                  Mobile Banking
                </button>
              </div>

              {paymentMethod === 'bank' && (
                <div className="space-y-4">
                  <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Bank Name *" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
                  <input type="text" value={bankBranch} onChange={(e) => setBankBranch(e.target.value)} placeholder="Branch Name" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
                  <input type="text" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} placeholder="Account Holder Name *" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
                  <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Account Number *" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
                  <input type="text" value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} placeholder="Routing Number" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
                </div>
              )}

              {paymentMethod === 'mfs' && (
                <div className="space-y-4">
                  <select value={mfsProvider} onChange={(e) => setMfsProvider(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm bg-white">
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                  </select>
                  <input type="tel" value={mfsNumber} onChange={(e) => setMfsNumber(e.target.value)} placeholder="Mobile Banking Number *" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Nominee & Declarations */}
      {step === 3 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#0A5C36] rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900">Nominee & Agreement</h4>
              <p className="text-gray-500 text-xs">মনোনীত ব্যক্তি ও ঘোষণা</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Nominee Full Name *</label>
              <input type="text" value={nomineeName} onChange={(e) => setNomineeName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Relation to You *</label>
                <input type="text" value={nomineeRelation} onChange={(e) => setNomineeRelation(e.target.value)} placeholder="e.g. Spouse, Father" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nominee Mobile *</label>
                <input type="tel" value={nomineeMobile} onChange={(e) => setNomineeMobile(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Nominee NID / Birth Registration No.</label>
              <input type="text" value={nomineeNid} onChange={(e) => setNomineeNid(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
            </div>
          </div>

          <div className="bg-[#F7F4EE] rounded-xl p-4 space-y-3">
            <p className="font-bold text-sm text-gray-800 mb-2">Terms, Conditions & Shariah Compliance Agreement</p>
            <label className="flex items-start gap-2.5 text-sm text-gray-700">
              <input type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)} className="mt-1 w-4 h-4 accent-[#0A5C36]" />
              <span>I knowingly acknowledge that my investment with Origin Agro is under the Shariah-based Musharakah partnership principle, with capital jointly contributed by both parties.</span>
            </label>
            <label className="flex items-start gap-2.5 text-sm text-gray-700">
              <input type="checkbox" checked={agreedNotFixed} onChange={(e) => setAgreedNotFixed(e.target.checked)} className="mt-1 w-4 h-4 accent-[#0A5C36]" />
              <span>I understand this is not an interest-based or fixed deposit. My profit share is determined by the actual business profit or loss.</span>
            </label>
            <label className="flex items-start gap-2.5 text-sm text-gray-700">
              <input type="checkbox" checked={agreedLossRisk} onChange={(e) => setAgreedLossRisk(e.target.checked)} className="mt-1 w-4 h-4 accent-[#0A5C36]" />
              <span>I accept that agro/farming products are perishable and dependent on natural conditions. In case of a genuine business loss, my capital may reduce proportionally under Musharakah principles.</span>
            </label>
            <label className="flex items-start gap-2.5 text-sm text-gray-700">
              <input type="checkbox" checked={agreedSignature} onChange={(e) => setAgreedSignature(e.target.checked)} className="mt-1 w-4 h-4 accent-[#0A5C36]" />
              <span>I provide this as my digital signature of consent to these terms.</span>
            </label>
          </div>
        </div>
      )}

      {errorMsg && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mt-4">{errorMsg}</p>
      )}

      <div className="flex gap-3 mt-6">
        {step > 1 && (
          <button type="button" onClick={goBack} className="flex-1 py-3.5 rounded-xl font-bold border-2 border-gray-200 text-gray-700 hover:border-[#0A5C36] transition-colors flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
        {step < 3 && (
          <button type="button" onClick={goNext} className="flex-1 py-3.5 rounded-xl font-bold bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors flex items-center justify-center gap-2">
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        {step === 3 && (
          <button type="button" onClick={handleSubmit} disabled={submitting} className="flex-1 py-3.5 rounded-xl font-bold bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors disabled:opacity-60">
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        )}
      </div>
    </div>
  )
}
