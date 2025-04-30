import { useState, useEffect } from 'react'

function App() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/contacts')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch contacts')
      }

      setContacts(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleInvitation = async (email) => {
    try {
      const response = await fetch(`https://hellenicdentch-backend.vercel.app/api/contacts/invitation/${email}`, {
        method: 'PUT'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update invitation status');
      }

      // Update the local state
      setContacts(contacts.map(contact => 
        contact.email === email 
          ? { ...contact, invitationSent: !contact.invitationSent }
          : contact
      ));
    } catch (err) {
      console.error('Error toggling invitation:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Contact Submissions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <div key={contact._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative">
            {/* Invitation Status Indicator */}
            <div className="absolute top-4 right-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                contact.invitationSent 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {contact.invitationSent ? 'Sent' : 'Not Sent'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Vorname</h3>
                <p className="text-lg font-semibold text-gray-800">
                  {contact.vorname}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Nachname</h3>
                <p className="text-lg font-semibold text-gray-800">
                  {contact.nachname}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-gray-800">{contact.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Praxis</h3>
                <p className="text-gray-800">{contact.praxis}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Submitted</h3>
                <p className="text-gray-600 text-sm">
                  {new Date(contact.createdAt).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => toggleInvitation(contact.email)}
                  className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    contact.invitationSent
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {contact.invitationSent ? 'Mark as Not Sent' : 'Mark as Sent'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {contacts.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          No contacts found.
        </div>
      )}
    </div>
  )
}

export default App
