---
title: A CLI for agents
description: I built a small tool with Claude Code, then handed it back. My agents run it, not me.
date: 2026-08-06
---

I use Claude Code every day, and I often want more than one session at once. Say
I want a review: one session on the code, one on the docs, one on the design.
None of them changes a file, so there is no reason to run them one after
another. Opening them by hand every time is boring, and the one who knows how
the work divides is not me. It is the main session.

## The problem

Claude Code can already spawn agents inside a session, and for this they are not
useful. A subagent is not a full session, and it sits behind a panel that shows
one transcript at a time. I want three real sessions in front of me, working
while I watch them.

So I asked Claude Code to write a tool, and then I gave the tool back to it.

## The tool

`claude-split`, one prompt per pane:

```bash
claude-split "review the code" "review the docs" "review the design"
```

Three Ghostty panes. Each one is a real session with its own prompt, already
running.

A pane can also get its own folder, which is how two of them write code at the
same time without stepping on each other. One issue, one worktree, one branch:

```bash
claude-split -l col -D .worktrees/issue-12 -D .worktrees/issue-13 \
  "work issue #12" "work issue #13"
```

The model and the effort level are flags on the same command:

```bash
claude-split -m opus -e high "review the last changes"
```

One value covers every pane. A list is handed out in order, the same way the
folders are, so a pane that only reads can stay on a cheaper model.

Now I say "split this up" and the panes appear.

## The point

The tool is one file and it only runs on my local. It saves a few seconds each
time, and I reach for it maybe ten times a day.

It took an afternoon to write, and I did not have to find it, wait for it, or
build it alone. Every step I still repeat by hand is a tool I have
not written yet, and there is no longer a good reason to leave one unwritten.

[claude-split on github](https://github.com/chefberke/claude-split)
