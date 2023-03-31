import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface DraftEntry {
  'id' : bigint,
  'title' : string,
  'owner' : string,
  'text' : string,
  'draftedAT' : bigint,
}
export interface Kawak {
  'addAdmin' : ActorMethod<[Principal], undefined>,
  'createEssay' : ActorMethod<
    [string, string, bigint, bigint, string],
    Result_1,
  >,
  'createProfile' : ActorMethod<[string, string], Result>,
  'deleteDraft' : ActorMethod<[bigint], undefined>,
  'draftEssay' : ActorMethod<[string, string], bigint>,
  'editDraft' : ActorMethod<[bigint, string, string], undefined>,
  'getAdmins' : ActorMethod<[], Array<Principal>>,
  'getMyDrafts' : ActorMethod<[string], [] | [Array<DraftEntry>]>,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : [bigint, string] } |
  { 'err' : string };
export interface _SERVICE extends Kawak {}
