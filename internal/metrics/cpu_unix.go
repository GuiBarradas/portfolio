//go:build unix

package metrics

import "syscall"

// cpuTimes returns user and system CPU time consumed by this process, in milliseconds.
func cpuTimes() (userMs, sysMs int64) {
	var ru syscall.Rusage
	if err := syscall.Getrusage(syscall.RUSAGE_SELF, &ru); err != nil {
		return 0, 0
	}
	return int64(ru.Utime.Sec)*1000 + int64(ru.Utime.Usec)/1000,
		int64(ru.Stime.Sec)*1000 + int64(ru.Stime.Usec)/1000
}
