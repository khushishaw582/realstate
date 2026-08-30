import { useState } from 'react'
import { AlertCircle, CheckCircle2, Upload, Download } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../api/axios'

export default function LeadUpload() {
  // Manual single-lead form state
  const [customerName, setCustomerName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [location, setLocation] = useState('')
  const [source, setSource] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [duplicateInfo, setDuplicateInfo] = useState(null)
  const [saving, setSaving] = useState(false)

  // Bulk upload state
  const [file, setFile] = useState(null)
  const [bulkResult, setBulkResult] = useState(null)
  const [bulkError, setBulkError] = useState('')
  const [uploading, setUploading] = useState(false)

  const resetForm = () => {
    setCustomerName('')
    setPhoneNumber('')
    setLocation('')
    setSource('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setDuplicateInfo(null)

    if (!customerName || !phoneNumber) {
      setError('Customer name and phone number are required')
      return
    }

    setSaving(true)
    try {
      await api.post('/leads/', {
        customer_name: customerName,
        phone_number: phoneNumber,
        location,
        source,
      })
      setSuccess('Lead uploaded successfully')
      resetForm()
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setDuplicateInfo(err.response.data)
      } else {
        setError('Failed to upload lead')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setBulkResult(null)
    setBulkError('')
  }

  const handleBulkUpload = async () => {
    if (!file) {
      setBulkError('Please select a CSV or Excel file')
      return
    }

    setUploading(true)
    setBulkError('')
    setBulkResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await api.post('/leads/bulk-upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setBulkResult(res.data)
      setFile(null)
    } catch (err) {
      setBulkError(err.response?.data?.error || 'Bulk upload failed')
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = 'Customer Name,Phone Number,Location,Source\nJohn Doe,+919876543210,Mumbai,Website\n'
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lead_upload_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 max-w-xl">
          <h1 className="text-xl font-semibold text-text-primary mb-6">
            Upload Leads
          </h1>

          {/* Bulk Upload Section */}
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-medium text-text-primary">Bulk Upload</h2>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover font-medium"
              >
                <Download size={14} />
                Download Template
              </button>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Upload a CSV or Excel file with columns: Customer Name, Phone Number, Location, Source
            </p>

            {bulkError && (
              <div className="flex items-center gap-2 text-sm text-hot bg-hot/5 border border-hot/20 rounded-md px-3 py-2 mb-4">
                <AlertCircle size={16} />
                {bulkError}
              </div>
            )}

            {bulkResult && (
              <div className="text-sm bg-green-50 border border-green-200 rounded-md px-3 py-3 mb-4 space-y-1">
                <p className="flex items-center gap-2 text-green-700 font-medium">
                  <CheckCircle2 size={16} />
                  {bulkResult.created_count} lead(s) uploaded successfully
                </p>
                {bulkResult.duplicate_count > 0 && (
                  <p className="text-warm">
                    {bulkResult.duplicate_count} duplicate(s) skipped (phone number already exists)
                  </p>
                )}
                {bulkResult.error_count > 0 && (
                  <p className="text-hot">
                    {bulkResult.error_count} row(s) had errors (missing name/phone)
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <div className="input-field flex items-center gap-2 text-text-secondary">
                  <Upload size={16} />
                  {file ? file.name : 'Choose CSV or Excel file'}
                </div>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleBulkUpload}
                disabled={uploading || !file}
                className="btn-primary disabled:opacity-60 whitespace-nowrap"
              >
                {uploading ? 'Uploading...' : 'Upload File'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-secondary">OR ADD MANUALLY</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Manual Single Upload Form */}
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-sm text-hot bg-hot/5 border border-hot/20 rounded-md px-3 py-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                <CheckCircle2 size={16} />
                {success}
              </div>
            )}

            {duplicateInfo && (
              <div className="text-sm text-warm bg-warm/5 border border-warm/20 rounded-md px-3 py-3 space-y-1">
                <p className="font-medium flex items-center gap-2">
                  <AlertCircle size={16} />
                  Duplicate phone number detected
                </p>
                <p>Existing Lead: {duplicateInfo.customer_name}</p>
                <p>Assigned Agent: {duplicateInfo.assigned_agent_name}</p>
                <p>Last Contact: {duplicateInfo.last_contact_date}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input-field"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="input-field"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Location (optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field"
                placeholder="City / Area"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Source (optional)
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="input-field"
                placeholder="Website, Referral, etc."
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-60"
            >
              {saving ? 'Uploading...' : 'Upload Lead'}
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}