-- Allow workspace admins to delete the workspace
create policy "Admin deleta workspace"
  on workspaces for delete
  using (
    id in (
      select workspace_id from workspace_members
      where user_id = auth.uid() and role = 'admin'
    )
  );
