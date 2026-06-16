// Central, editable content model for the portal.
// Every <<placeholder>> field on the slides resolves from here.
// The Admin page edits this; it persists to localStorage and is the same
// shape the backend API is expected to serve (see /API.md).

import type { StatusKey } from './status'

export const uid = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

export interface MilestoneRow {
  id: string
  label: string
  due: string
  revised: string
  status: StatusKey
}

export interface MilestoneSection {
  id: string
  title: string
  rows: MilestoneRow[]
}

export type ActionStatus = 'open' | 'inProgress' | 'closed'

export interface RiskAction {
  id: string
  action: string
  owner: string
  dueDate: string
  actionStatus: ActionStatus
}

export interface IssueRow {
  id: string
  issue: string
  mitigations: string[]
  date: string
  status: StatusKey
  needsPremeraAttention?: boolean
  riskActions?: RiskAction[]
}

export interface TowerGoLive {
  id: string
  name: string
  goLive: string
  status: StatusKey
}

// Icon keys map to lucide components in ProgramLevel.tsx
export type WorkstreamIcon =
  | 'share2'
  | 'userCog'
  | 'arrowLeftRight'
  | 'truck'
  | 'building2'
  | 'shieldCheck'
  | 'clipboardCheck'

export interface Workstream {
  id: string
  icon: WorkstreamIcon
  name: string
  status: StatusKey
  accomplishments: string[]
  activities: string[]
}

export interface ProgramTab {
  levelLabel: string
  workstreams: Workstream[]
  towers: TowerGoLive[]
  milestones: MilestoneSection[]
  issues: IssueRow[]
}

export interface PortalData {
  asOf: string
  program: {
    ito: ProgramTab
    bpo: ProgramTab
  }
  tower: {
    levelLabel: string
    accomplishments: string[]
    activities: string[]
    milestones: MilestoneSection[]
    keyActivities: MilestoneSection[]
    issues: IssueRow[]
  }
}

const fill = (text: string, n: number) => Array.from({ length: n }, () => text)

export const DEFAULT_PORTAL_DATA: PortalData = {
  asOf: 'DD/MM/YYYY',
  program: {
    ito: {
      levelLabel: '<<ITO Program Level>>',
      workstreams: [
        { id: 'ws1', icon: 'share2', name: 'Communications & Change Management', status: 'onTrack', accomplishments: fill('<<accomplishment>>', 2), activities: fill('<<planned activity>>', 2) },
        { id: 'ws2', icon: 'userCog', name: 'HR Conversion', status: 'onTrack', accomplishments: fill('<<accomplishment>>', 2), activities: fill('<<planned activity>>', 2) },
        { id: 'ws3', icon: 'arrowLeftRight', name: 'Knowledge Transition/Hiring', status: 'onTrack', accomplishments: fill('<<accomplishment>>', 2), activities: fill('<<planned activity>>', 2) },
        { id: 'ws4', icon: 'truck', name: 'Delivery & Operational Continuity', status: 'atRisk', accomplishments: fill('<<accomplishment>>', 3), activities: fill('<<planned activity>>', 2) },
        { id: 'ws5', icon: 'building2', name: 'Infrastructure & Facilities', status: 'atRisk', accomplishments: fill('<<accomplishment>>', 2), activities: fill('<<planned activity>>', 2) },
        { id: 'ws6', icon: 'shieldCheck', name: 'Information Security', status: 'onTrack', accomplishments: fill('<<accomplishment>>', 2), activities: fill('<<planned activity>>', 2) },
        { id: 'ws7', icon: 'clipboardCheck', name: 'Day One Readiness', status: 'onTrack', accomplishments: fill('<<accomplishment>>', 2), activities: fill('<<planned activity>>', 2) },
      ],
      towers: [
        { id: 'tg1', name: 'ITO', goLive: '4/1/2025', status: 'onTrack' },
        { id: 'tg2', name: 'BPO', goLive: '4/1/2025', status: 'onTrack' },
      ],
      milestones: [
        {
          id: 'pm1',
          title: 'Critical Transition Milestones',
          rows: [
            { id: 'pmr1', label: "SOW's Approved", due: '1/16/2025', revised: '1/27/2025', status: 'complete' },
            { id: 'pmr2', label: 'Transition Plan', due: '1/22/2025', revised: '1/28/2025', status: 'complete' },
            { id: 'pmr3', label: 'Associates/Contractor Communications', due: '2/10/2025', revised: '2/10/2025', status: 'complete' },
            { id: 'pmr4', label: 'Phase 1 Activities Completed', due: '3/26/2025', revised: '', status: 'onTrack' },
            { id: 'pmr5', label: 'Service Commencement Date', due: '4/1/2025', revised: '', status: 'onTrack' },
          ],
        },
        {
          id: 'pm2',
          title: 'Phase 1 Pre-Commencement Date Activités',
          rows: [
            { id: 'pmr6', label: 'Transition Planning/Plan', due: '1/25/2025', revised: '1/28/2025', status: 'complete' },
            { id: 'pmr7', label: 'Associates/Contractor Communications', due: '2/10/2025', revised: '', status: 'complete' },
            { id: 'pmr8', label: 'Contractor Transition', due: '3/26/2025', revised: '', status: 'atRisk' },
            { id: 'pmr9', label: 'eBiz Service Desk Transition', due: '3/26/2025', revised: '', status: 'onTrack' },
            { id: 'pmr10', label: 'Document As-Is PPM standards', due: '3/26/2025', revised: '', status: 'onTrack' },
            { id: 'pmr11', label: 'SLA Reporting Plan/Prep/Alignment', due: '3/26/2025', revised: '', status: 'atRisk' },
            { id: 'pmr12', label: 'Infrastructure Connectivity Readiness', due: '3/26/2025', revised: '', status: 'onTrack' },
            { id: 'pmr13', label: 'Automation Assessment', due: '3/26/2025', revised: '', status: 'onTrack' },
          ],
        },
        {
          id: 'pm3',
          title: 'Phase 2 Post-Commencement Date Activités',
          rows: [
            { id: 'pmr14', label: 'Service Stability', due: '4/1/2025', revised: '', status: 'onTrack' },
            { id: 'pmr15', label: 'Work Volume Baselining', due: '9/30/2025', revised: '', status: 'onTrack' },
            { id: 'pmr16', label: 'Implementing Process Standardizations', due: '8/1/2025', revised: '', status: 'onTrack' },
            { id: 'pmr17', label: 'PPM final version', due: '7/1/2025', revised: '', status: 'onTrack' },
          ],
        },
      ],
      issues: [
        { id: 'pi1', issue: '<<Issue/Risk/Dependency>>', mitigations: ['Mitigation plan / next steps'], date: '2/24', status: 'atRisk', needsPremeraAttention: true, riskActions: [{ id: 'ra1', action: '<<Risk mitigation action>>', owner: '<<Owner>>', dueDate: '3/15', actionStatus: 'open' }] },
        { id: 'pi2', issue: '<<Issue/Risk/Dependency>>', mitigations: ['Mitigation plan / next steps'], date: '2/28', status: 'atRisk', riskActions: [{ id: 'ra2', action: '<<Risk mitigation action>>', owner: '<<Owner>>', dueDate: '3/20', actionStatus: 'inProgress' }] },
        { id: 'pi3', issue: '<<Issue/Risk/Dependency>>', mitigations: ['Mitigation plan / next steps'], date: '3/10', status: 'atRisk', riskActions: [] },
        { id: 'pi4', issue: '<<Issue/Risk/Dependency>>', mitigations: ['Mitigation plan / next steps', 'Mitigation plan / next steps'], date: '3/26', status: 'atRisk', riskActions: [] },
      ],
    },
    bpo: {
      levelLabel: '<<BPO Program Level>>',
      workstreams: [
        { id: 'bws1', icon: 'share2', name: 'Communications & Change Management', status: 'onTrack', accomplishments: fill('<<accomplishment>>', 2), activities: fill('<<planned activity>>', 2) },
        { id: 'bws2', icon: 'userCog', name: 'HR Conversion', status: 'onTrack', accomplishments: fill('<<accomplishment>>', 2), activities: fill('<<planned activity>>', 2) },
        { id: 'bws3', icon: 'arrowLeftRight', name: 'Knowledge Transition/Hiring', status: 'onTrack', accomplishments: fill('<<accomplishment>>', 2), activities: fill('<<planned activity>>', 2) },
        { id: 'bws4', icon: 'truck', name: 'Delivery & Operational Continuity', status: 'atRisk', accomplishments: fill('<<accomplishment>>', 3), activities: fill('<<planned activity>>', 2) },
        { id: 'bws5', icon: 'building2', name: 'Infrastructure & Facilities', status: 'atRisk', accomplishments: fill('<<accomplishment>>', 2), activities: fill('<<planned activity>>', 2) },
        { id: 'bws6', icon: 'shieldCheck', name: 'Information Security', status: 'onTrack', accomplishments: fill('<<accomplishment>>', 2), activities: fill('<<planned activity>>', 2) },
        { id: 'bws7', icon: 'clipboardCheck', name: 'Day One Readiness', status: 'onTrack', accomplishments: fill('<<accomplishment>>', 2), activities: fill('<<planned activity>>', 2) },
      ],
      towers: [
        { id: 'btg1', name: 'ITO', goLive: '4/1/2025', status: 'onTrack' },
        { id: 'btg2', name: 'BPO', goLive: '4/1/2025', status: 'onTrack' },
      ],
      milestones: [
        {
          id: 'bpm1',
          title: 'Critical Transition Milestones',
          rows: [
            { id: 'bpmr1', label: "SOW's Approved", due: '1/16/2025', revised: '1/27/2025', status: 'complete' },
            { id: 'bpmr2', label: 'Transition Plan', due: '1/22/2025', revised: '1/28/2025', status: 'complete' },
            { id: 'bpmr3', label: 'Associates/Contractor Communications', due: '2/10/2025', revised: '2/10/2025', status: 'complete' },
            { id: 'bpmr4', label: 'Phase 1 Activities Completed', due: '3/26/2025', revised: '', status: 'onTrack' },
            { id: 'bpmr5', label: 'Service Commencement Date', due: '4/1/2025', revised: '', status: 'onTrack' },
          ],
        },
        {
          id: 'bpm2',
          title: 'Phase 1 Pre-Commencement Date Activités',
          rows: [
            { id: 'bpmr6', label: 'Transition Planning/Plan', due: '1/25/2025', revised: '1/28/2025', status: 'complete' },
            { id: 'bpmr7', label: 'Associates/Contractor Communications', due: '2/10/2025', revised: '', status: 'complete' },
            { id: 'bpmr8', label: 'Contractor Transition', due: '3/26/2025', revised: '', status: 'atRisk' },
            { id: 'bpmr9', label: 'eBiz Service Desk Transition', due: '3/26/2025', revised: '', status: 'onTrack' },
            { id: 'bpmr10', label: 'Document As-Is PPM standards', due: '3/26/2025', revised: '', status: 'onTrack' },
            { id: 'bpmr11', label: 'SLA Reporting Plan/Prep/Alignment', due: '3/26/2025', revised: '', status: 'atRisk' },
            { id: 'bpmr12', label: 'Infrastructure Connectivity Readiness', due: '3/26/2025', revised: '', status: 'onTrack' },
            { id: 'bpmr13', label: 'Automation Assessment', due: '3/26/2025', revised: '', status: 'onTrack' },
          ],
        },
        {
          id: 'bpm3',
          title: 'Phase 2 Post-Commencement Date Activités',
          rows: [
            { id: 'bpmr14', label: 'Service Stability', due: '4/1/2025', revised: '', status: 'onTrack' },
            { id: 'bpmr15', label: 'Work Volume Baselining', due: '9/30/2025', revised: '', status: 'onTrack' },
            { id: 'bpmr16', label: 'Implementing Process Standardizations', due: '8/1/2025', revised: '', status: 'onTrack' },
            { id: 'bpmr17', label: 'PPM final version', due: '7/1/2025', revised: '', status: 'onTrack' },
          ],
        },
      ],
      issues: [
        { id: 'bpi1', issue: '<<Issue/Risk/Dependency>>', mitigations: ['Mitigation plan / next steps'], date: '2/24', status: 'atRisk', needsPremeraAttention: true, riskActions: [{ id: 'bra1', action: '<<Risk mitigation action>>', owner: '<<Owner>>', dueDate: '3/15', actionStatus: 'open' }] },
        { id: 'bpi2', issue: '<<Issue/Risk/Dependency>>', mitigations: ['Mitigation plan / next steps'], date: '2/28', status: 'atRisk', riskActions: [{ id: 'bra2', action: '<<Risk mitigation action>>', owner: '<<Owner>>', dueDate: '3/20', actionStatus: 'inProgress' }] },
        { id: 'bpi3', issue: '<<Issue/Risk/Dependency>>', mitigations: ['Mitigation plan / next steps'], date: '3/10', status: 'atRisk', riskActions: [] },
        { id: 'bpi4', issue: '<<Issue/Risk/Dependency>>', mitigations: ['Mitigation plan / next steps', 'Mitigation plan / next steps'], date: '3/26', status: 'atRisk', riskActions: [] },
      ],
    },
  },
  tower: {
    levelLabel: '<<Tower Level>>',
    accomplishments: fill('<<key accomplishment>>', 9),
    activities: fill('<<planned activity>>', 11),
    milestones: [
      {
        id: 'tm1',
        title: 'Critical Transition Milestones',
        rows: [
          { id: 'tmr1', label: "SOW's Approved", due: '1/16/2025', revised: '1/27/2025', status: 'complete' },
          { id: 'tmr2', label: 'Transition Plan', due: '1/22/2025', revised: '1/28/2025', status: 'complete' },
          { id: 'tmr3', label: 'Associates/Contractor Communications', due: '2/10/2025', revised: '', status: 'complete' },
          { id: 'tmr4', label: 'Phase 1 Activities Completed', due: '3/26/2025', revised: '', status: 'onTrack' },
          { id: 'tmr5', label: 'Service Commencement Date', due: '4/1/2025', revised: '', status: 'onTrack' },
        ],
      },
    ],
    keyActivities: [
      {
        id: 'ta1',
        title: 'Phase 1 Pre-Commencement Date Activités',
        rows: [
          { id: 'tar1', label: 'Transition Planning/Plan', due: '1/25/2025', revised: '1/28/2025', status: 'complete' },
          { id: 'tar2', label: 'Associates/Contractor Communications', due: '2/10/2025', revised: '', status: 'complete' },
          { id: 'tar3', label: 'Contractor Transition', due: '3/26/2025', revised: '', status: 'onTrack' },
          { id: 'tar4', label: 'eBiz Service Desk Transition', due: '3/26/2025', revised: '', status: 'atRisk' },
          { id: 'tar5', label: 'Document As-Is PPM standards', due: '3/26/2025', revised: '', status: 'onTrack' },
          { id: 'tar6', label: 'SLA Reporting Plan/Prep/Alignment', due: '3/26/2025', revised: '', status: 'onTrack' },
          { id: 'tar7', label: 'Infrastructure Connectivity Readiness', due: '3/26/2025', revised: '', status: 'atRisk' },
          { id: 'tar8', label: 'Automation Assessment', due: '3/26/2025', revised: '', status: 'onTrack' },
        ],
      },
      {
        id: 'ta2',
        title: 'Phase 2 Post-Commencement Date Activités',
        rows: [
          { id: 'tar9', label: 'Service Stability', due: '4/1/2025', revised: '', status: 'onTrack' },
          { id: 'tar10', label: 'Work Volume Collection and PPM', due: '7/1/2025', revised: '', status: 'onTrack' },
          { id: 'tar11', label: 'Implementing Process Standardizations', due: '8/1/2025', revised: '', status: 'onTrack' },
        ],
      },
    ],
    issues: [
      { id: 'ti1', issue: '<<Issue/Risk/Dependency>>', mitigations: ['Mitigation plan / next steps'], date: '2/23', status: 'atRisk', needsPremeraAttention: true, riskActions: [{ id: 'tra1', action: '<<Risk mitigation action>>', owner: '<<Owner>>', dueDate: '3/10', actionStatus: 'open' }] },
      { id: 'ti2', issue: '<<Issue/Risk/Dependency>>', mitigations: ['Mitigation plan / next steps'], date: '2/24', status: 'atRisk', riskActions: [{ id: 'tra2', action: '<<Risk mitigation action>>', owner: '<<Owner>>', dueDate: '3/15', actionStatus: 'inProgress' }] },
      { id: 'ti3', issue: '<<Issue/Risk/Dependency>>', mitigations: ['Mitigation plan / next steps'], date: '2/26', status: 'atRisk', riskActions: [] },
      { id: 'ti4', issue: '<<Issue/Risk/Dependency>>', mitigations: ['Mitigation plan / next steps', 'Mitigation plan / next steps'], date: '2/26', status: 'atRisk', riskActions: [] },
    ],
  },
}
