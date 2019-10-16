EXECS=ring
MPICC?=mpicc

all: ${EXECS}

ring: ring.c
	${MPICC} -o ring -I. ring_tp.c ring.c -llttng-ust -ldl

clean:
	rm -f ${EXECS}
