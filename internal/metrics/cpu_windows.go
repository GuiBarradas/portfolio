//go:build windows

package metrics

import "syscall"

// cpuTimes returns user and system CPU time consumed by this process, in milliseconds.
// FILETIME values are 100ns ticks.
func cpuTimes() (userMs, sysMs int64) {
	h, err := syscall.GetCurrentProcess()
	if err != nil {
		return 0, 0
	}
	var creation, exit, kernel, user syscall.Filetime
	if err := syscall.GetProcessTimes(h, &creation, &exit, &kernel, &user); err != nil {
		return 0, 0
	}
	ticks := func(ft syscall.Filetime) int64 {
		return int64(ft.HighDateTime)<<32 | int64(ft.LowDateTime)
	}
	return ticks(user) / 10_000, ticks(kernel) / 10_000
}
