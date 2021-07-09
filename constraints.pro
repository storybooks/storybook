% This rule enforces that all workspaces must depend on other workspaces using `workspace:*`
gen_enforced_dependency(WorkspaceCwd, DependencyIdent, 'workspace:*', DependencyType) :-
  workspace_has_dependency(WorkspaceCwd, DependencyIdent, _, DependencyType),
  DependencyType \= 'peerDependencies',
  workspace_ident(DependencyCwd, DependencyIdent).
