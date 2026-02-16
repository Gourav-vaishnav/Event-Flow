import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEventById, deleteEvent } from '../services/eventService';
import { Event, Invitee, RSVPStatus } from '../types';
import RsvpChart from './RsvpChart';
import CalendarIcon from './icons/CalendarIcon';
import LocationIcon from './icons/LocationIcon';
import SendIcon from './icons/SendIcon';
import PhotoIcon from './icons/PhotoIcon';
import { GoogleGenAI } from '@google/genai';


const StatusBadge: React.FC<{ status: RSVPStatus }> = ({ status }) => {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
  const statusClasses = {
    [RSVPStatus.Attending]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    [RSVPStatus.Maybe]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    [RSVPStatus.NotAttending]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    [RSVPStatus.Pending]: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};


const EventDashboard: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailBody, setEmailBody] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (eventId) {
      const currentEvent = getEventById(eventId);
      setEvent(currentEvent || null);
      setConfirmDelete(false);
    }
  }, [eventId]);

  const handleDelete = () => {
    if (event) {
        deleteEvent(event.id);
        navigate('/');
    }
  };

  const rsvpLink = `${window.location.href.split('#')[0]}#/rsvp/${eventId}`;

  const stats = useMemo(() => {
    if (!event) return { attending: 0, maybe: 0, notAttending: 0, pending: 0, total: 0, views: 0 };
    return {
      attending: event.invitees.filter(i => i.status === RSVPStatus.Attending).length,
      maybe: event.invitees.filter(i => i.status === RSVPStatus.Maybe).length,
      notAttending: event.invitees.filter(i => i.status === RSVPStatus.NotAttending).length,
      pending: event.invitees.filter(i => i.status === RSVPStatus.Pending).length,
      total: event.invitees.length,
      views: event.views || 0,
    };
  }, [event]);

  const handleOpenInviteModal = async () => {
    setIsInviteModalOpen(true);
    if (!emailBody) {
      await handleGenerateInvite();
    }
  };

  const handleGenerateInvite = async (regenerate = false) => {
    if (!event) return;
    if (isGenerating) return;

    setIsGenerating(true);
    if (regenerate) {
      setEmailBody('');
      setEmailSubject('');
    }

    try {
      if (!process.env.API_KEY) {
        alert("API_KEY environment variable not set. Please configure it to use the AI features.");
        throw new Error("API_KEY not found");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const prompt = `Write a friendly and concise email invitation for an event.
      Here are the event details:
      - Event Name: ${event.name}
      - Date and Time: ${new Date(event.datetime).toLocaleString()}
      - Location: ${event.location}
      - Description: ${event.description || 'No description provided.'}

      Your task is to generate the body of the email.
      Keep the tone welcoming and enthusiastic.
      Structure the email clearly with the event details.
      Conclude the email with this exact line, without any modifications: "To let us know if you can make it, please RSVP here: ${rsvpLink}"
      Do not add placeholders like "[Link]" or "[Event Name]". Use the actual details provided.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setEmailBody(response.text);
      setEmailSubject(`You're invited to: ${event.name}!`);

    } catch (error) {
      // Error handled silently
      alert("Failed to generate email content. A default template will be used. You might need to check your API key or network connection. Please see the console for more details.");
      setEmailSubject(`Invitation: ${event.name}`);
      setEmailBody(
        `Hello,\n\nYou are invited to the following event:\n\n` +
        `Event: ${event.name}\n` +
        `When: ${new Date(event.datetime).toLocaleString()}\n` +
        `Where: ${event.location}\n\n` +
        `${event.description ? `Description:\n${event.description}\n\n` : ''}` +
        `To let us know if you can make it, please RSVP here: ${rsvpLink}`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const openMailClient = () => {
    if (!event) return;

    const pendingInvitees = event.invitees
        .filter(i => i.status === RSVPStatus.Pending)
        .map(i => i.email);

    if (pendingInvitees.length === 0) {
        alert("All invitees have responded. There are no pending invitations to send.");
        return;
    }

    const bcc = pendingInvitees.join(',');
    const subject = encodeURIComponent(emailSubject);
    const body = encodeURIComponent(emailBody);

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&bcc=${bcc}&su=${subject}&body=${body}`;
    
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    setIsInviteModalOpen(false);
  };

  const qrCodeUrl = useMemo(() => {
    if (!event?.photoAlbumUrl) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(event.photoAlbumUrl)}`;
  }, [event?.photoAlbumUrl]);

  if (!event) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl text-slate-600 dark:text-slate-400">Event not found.</h2>
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block">Back to My Events</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex justify-between items-start gap-4">
            <div>
                <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-2 inline-block">&larr; Back to Events</Link>
                <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{event.name}</h1>
            </div>
            <div className="flex-shrink-0 pt-8">
                {!confirmDelete ? (
                    <button onClick={() => setConfirmDelete(true)} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition duration-300">
                        Delete Event
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button onClick={handleDelete} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition">
                            Confirm Delete
                        </button>
                        <button onClick={() => setConfirmDelete(false)} className="text-slate-500 dark:text-slate-400 hover:underline">
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <aside className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Analytics</h2>
                    <div className="space-y-3 text-slate-600 dark:text-slate-300">
                        <div className="flex justify-between items-center"><span>RSVP Link Views:</span> <strong className="text-lg">{stats.views}</strong></div>
                        <hr className="border-slate-200 dark:border-slate-700" />
                        <div className="flex justify-between items-center"><span>Total Invited:</span> <strong className="text-lg">{stats.total}</strong></div>
                        <div className="flex justify-between items-center text-green-600 dark:text-green-400"><span>Attending:</span> <strong className="text-lg">{stats.attending}</strong></div>
                        <div className="flex justify-between items-center text-yellow-600 dark:text-yellow-400"><span>Maybe:</span> <strong className="text-lg">{stats.maybe}</strong></div>
                        <div className="flex justify-between items-center text-red-600 dark:text-red-400"><span>Not Attending:</span> <strong className="text-lg">{stats.notAttending}</strong></div>
                        <div className="flex justify-between items-center text-slate-500"><span>Pending:</span> <strong className="text-lg">{stats.pending}</strong></div>
                    </div>
                    <div className="mt-4">
                      <RsvpChart invitees={event.invitees} />
                    </div>
                </div>

                {event.photoAlbumUrl && (
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                      <PhotoIcon className="h-6 w-6 text-rose-500 dark:text-rose-400"/>
                      Event Photos
                    </h2>
                    <div className="flex flex-col items-center text-center gap-4">
                       <img src={qrCodeUrl} alt="Photo Album QR Code" className="rounded-lg bg-white p-2"/>
                       <p className="text-sm text-slate-500 dark:text-slate-400">Scan this code to open the shared photo album.</p>
                       <a href={event.photoAlbumUrl} target="_blank" rel="noopener noreferrer" className="w-full text-center bg-rose-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-rose-600 transition duration-300">
                         Open Album
                       </a>
                    </div>
                  </div>
                )}

            </aside>

            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Event Details</h3>
                    <div className="space-y-4">
                        <div className="flex items-center text-slate-600 dark:text-slate-300">
                            <CalendarIcon className="h-6 w-6 mr-3 text-indigo-500 dark:text-indigo-400" />
                            <span className="text-lg">{new Date(event.datetime).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-slate-600 dark:text-slate-300">
                            <LocationIcon className="h-6 w-6 mr-3 text-indigo-500 dark:text-indigo-400" />
                            <span className="text-lg">{event.location}</span>
                        </div>
                        {event.description && <p className="text-slate-700 dark:text-slate-400 pt-2 whitespace-pre-wrap">{event.description}</p>}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Share & Invite</h3>
                        <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-2 rounded-md">
                            <input type="text" readOnly value={rsvpLink} className="flex-grow bg-transparent focus:outline-none text-indigo-700 dark:text-indigo-300"/>
                            <button onClick={() => navigator.clipboard.writeText(rsvpLink)} className="ml-2 bg-indigo-500 text-white font-semibold text-sm px-3 py-1 rounded-md hover:bg-indigo-600 transition">Copy Link</button>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                              Use AI to generate and send email invitations to guests who haven't responded yet.
                            </p>
                            <button 
                              onClick={handleOpenInviteModal} 
                              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                              disabled={stats.pending === 0}
                              aria-label="Send email invitations to pending guests"
                            >
                              <SendIcon className="h-5 w-5" />
                              <span>{stats.pending > 0 ? `Email ${stats.pending} Pending Guests` : 'All Guests Responded'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Invitees ({stats.total})</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="p-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Email</th>
                                    <th className="p-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.invitees.map(invitee => (
                                    <tr key={invitee.email} className="border-b border-slate-100 dark:border-slate-700">
                                        <td className="p-2 text-slate-700 dark:text-slate-300">{invitee.email}</td>
                                        <td className="p-2"><StatusBadge status={invitee.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        {isInviteModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">AI-Generated Invitation</h2>
                <button 
                  onClick={() => setIsInviteModalOpen(false)} 
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4">
                {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    <p className="mt-4 text-slate-500 dark:text-slate-400">Generating your invitation...</p>
                    </div>
                ) : (
                    <>
                    <div>
                        <label htmlFor="email-subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                        <input 
                        type="text" 
                        id="email-subject" 
                        value={emailSubject} 
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email-body" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Body</label>
                        <textarea 
                        id="email-body"
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        rows={10}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    </>
                )}
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-end gap-3">
                <button onClick={() => setIsInviteModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                    Cancel
                </button>
                <button 
                    onClick={() => handleGenerateInvite(true)}
                    disabled={isGenerating}
                    className="px-4 py-2 rounded-lg text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-900 transition disabled:opacity-50"
                >
                    {isGenerating ? 'Generating...' : 'Regenerate'}
                </button>
                <button 
                    onClick={openMailClient}
                    disabled={isGenerating || !emailBody}
                    className="px-4 py-2 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition disabled:bg-slate-400 dark:disabled:bg-slate-600"
                >
                    Open in Gmail
                </button>
                </div>
            </div>
            </div>
        )}
    </div>
  );
};

export default EventDashboard;