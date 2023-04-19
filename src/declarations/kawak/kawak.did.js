export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Nat, IDL.Text),
    'err' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const DraftEntry = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'owner' : IDL.Text,
    'text' : IDL.Text,
    'draftedAT' : IDL.Int,
  });
  const Kawak = IDL.Service({
    'addAdmin' : IDL.Func([IDL.Principal], [], []),
    'createEssay' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Nat, IDL.Text],
        [Result_1],
        [],
      ),
    'createProfile' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'deleteDraft' : IDL.Func([IDL.Nat], [], []),
    'draftEssay' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
    'editDraft' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [], ['oneway']),
    'getAdmins' : IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    'getMyDrafts' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Vec(DraftEntry))], []),
  });
  return Kawak;
};
export const init = ({ IDL }) => { return []; };
