import type { ApprovalRequestDetailResponse } from '@/types/approval-request-detail'

export function getMockApprovalRequestDetail(
  id: string
): ApprovalRequestDetailResponse {
  return {
    request: {
      id,
      user_id: 'user-1',
      title: 'Cabinet Selection',
      description: 'Please select your preferred cabinet option for the kitchen renovation.',
      status: 'pending',
      created_at: '2025-02-18T10:00:00Z',
      updated_at: '2025-02-18T14:30:00Z',
      deadline: '2025-02-25',
      sent_at: '2025-02-18T14:30:00Z',
      recipients: ['john@smithresidence.com', 'jane@smithresidence.com'],
      project_name: 'Kitchen Renovation',
    },
    selections: [
      {
        id: 'sel-1',
        option_id: 'opt-1',
        option_title: 'Option A - Modern White',
        option_description: 'Contemporary white cabinets with soft-close hinges',
        selected_by: 'John Smith',
        selected_at: '2025-02-19T09:15:00Z',
        cost: '$2,500',
      },
    ],
    audit_trail: [
      {
        id: 'audit-1',
        action: 'Request sent',
        timestamp: '2025-02-18T14:30:00Z',
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        actor: 'System',
        details: 'Approval request sent to 2 recipients',
      },
      {
        id: 'audit-2',
        action: 'Selection made',
        timestamp: '2025-02-19T09:15:00Z',
        ip_address: '73.162.45.120',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)',
        actor: 'John Smith',
        details: 'Selected Option A - Modern White',
      },
    ],
    comments: [
      {
        id: 'comment-1',
        content: 'Can we get a sample of the cabinet finish before finalizing?',
        author: 'John Smith',
        author_email: 'john@smithresidence.com',
        created_at: '2025-02-19T09:20:00Z',
        resolved: false,
        flagged: false,
        replies: [
          {
            id: 'comment-2',
            content: 'Yes, I can arrange a sample delivery by Thursday.',
            author: 'Project Manager',
            created_at: '2025-02-19T11:00:00Z',
            resolved: false,
            flagged: false,
            parent_id: 'comment-1',
          },
        ],
      },
    ],
  }
}
