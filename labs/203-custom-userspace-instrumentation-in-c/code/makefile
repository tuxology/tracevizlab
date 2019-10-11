EXECS=ring
MPICC?=mpicc

all: ${EXECS}

ring: ring.c
	gcc -I. -c ring_tp.c
	${MPICC} -o ring ring_tp.o ring.c -llttng-ust -ldl

clean:
	rm -f ${EXECS}
